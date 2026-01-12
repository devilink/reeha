const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Load .env manually
try {
    const envPath = path.resolve(__dirname, '../.env');
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key) process.env[key] = val;
        }
    });
} catch (e) {
    console.log("Could not load .env:", e.message);
}

// Configuration
const AWS_CONFIG = {
    region: 'eu-north-1',
    tableName: 'Products',
    bucketName: 'label-reeha-shop-images',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

AWS.config.update({
    region: AWS_CONFIG.region,
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
});

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const docClient = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_DIR = path.resolve(__dirname, '../product_new');

function getContentType(filename) {
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
    if (filename.endsWith('.png')) return 'image/png';
    return 'application/octet-stream';
}

async function run() {
    try {
        if (!fs.existsSync(PRODUCTS_DIR)) {
            console.error(`Directory not found: ${PRODUCTS_DIR}`);
            return;
        }

        const files = fs.readdirSync(PRODUCTS_DIR);
        console.log(`Found ${files.length} files in ${PRODUCTS_DIR}`);

        // 1. Fetch all existing products to check for existence
        const scanData = await docClient.scan({ TableName: AWS_CONFIG.tableName }).promise();
        const existingProducts = scanData.Items || [];
        const nameToId = {};
        existingProducts.forEach(p => {
            if (p.name) nameToId[p.name] = p.id;
        });

        for (const file of files) {
            if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

            // Parse filename: "LR 106.jpeg" -> "Label Reeha 106"
            const numberMatch = file.match(/LR\s+(\d+)/i);
            if (!numberMatch) {
                console.warn(`Skipping file ${file}: Does not match 'LR {number}' pattern`);
                continue;
            }

            const productNumber = numberMatch[1];
            const productName = `Label Reeha ${productNumber}`;
            const filePath = path.join(PRODUCTS_DIR, file);
            const fileContent = fs.readFileSync(filePath);

            // Generate S3 Key
            const productIdForS3 = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const s3Key = `products/${productIdForS3}_${file.replace(/\s+/g, '_')}`;

            console.log(`Processing: ${file} -> ${productName}...`);

            // Upload to S3
            const uploadParams = {
                Bucket: AWS_CONFIG.bucketName,
                Key: s3Key,
                Body: fileContent,
                ContentType: getContentType(file)
            };

            let imageUrl = "";
            try {
                const uploadResult = await s3.upload(uploadParams).promise();
                imageUrl = uploadResult.Location;
                console.log(`  Uploaded to S3: ${imageUrl}`);
            } catch (err) {
                console.error(`  Failed to upload to S3: ${err.message}`);
                continue;
            }

            // Update or Create in DynamoDB
            const existingId = nameToId[productName];

            if (existingId) {
                // Update existing
                try {
                    await docClient.update({
                        TableName: AWS_CONFIG.tableName,
                        Key: { "id": existingId },
                        UpdateExpression: "set imageUrl = :u",
                        ExpressionAttributeValues: { ":u": imageUrl },
                        ReturnValues: "UPDATED_NEW"
                    }).promise();
                    console.log(`  UPDATED existing product: ${productName} (ID: ${existingId})`);
                } catch (err) {
                    console.error(`  Failed to update DynamoDB: ${err.message}`);
                }
            } else {
                // Create new
                const productId = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000); // Unique ID for DB
                const newItem = {
                    id: productId,
                    name: productName,
                    price: 2500, // Default price as placeholder, can be changed later
                    imageUrl: imageUrl,
                    instaUrl: '',
                    fbUrl: '',
                    createdAt: new Date().toISOString()
                };

                try {
                    await docClient.put({
                        TableName: AWS_CONFIG.tableName,
                        Item: newItem
                    }).promise();
                    console.log(`  CREATED new product: ${productName} (ID: ${productId})`);

                    // Update map to avoid duplicates if file processed twice (unlikely here but good practice)
                    nameToId[productName] = productId;
                } catch (err) {
                    console.error(`  Failed to create in DynamoDB: ${err.message}`);
                }
            }

            // Small delay
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log("Upload process complete.");

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

run();
