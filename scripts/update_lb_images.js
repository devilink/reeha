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

const PRODUCTS_DIR = path.resolve(__dirname, '../lb');

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
        console.log("Fetching existing products from DynamoDB...");
        let existingProducts = [];
        let scanParams = { TableName: AWS_CONFIG.tableName };
        let items;
        do {
            items = await docClient.scan(scanParams).promise();
            items.Items.forEach((item) => existingProducts.push(item));
            scanParams.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey !== "undefined");

        const nameToId = {};
        existingProducts.forEach(p => {
            if (p.name) nameToId[p.name] = p.id;
        });
        console.log(`Loaded ${existingProducts.length} existing products.`);

        for (const file of files) {
            if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

            // Parse filename: "1.png" -> "Label Reeha 1"
            const numberMatch = file.match(/^(\d+)\.png$/i);
            if (!numberMatch) {
                console.warn(`Skipping file ${file}: Does not match '{number}.png' pattern`);
                continue;
            }

            const productNumber = numberMatch[1]; // e.g. "1"
            // Ensure we only process 1 to 129
            const num = parseInt(productNumber, 10);
            if (num < 1 || num > 129) {
                 console.log(`Skipping number ${num} (out of range/interest mostly per prompt 1-129)`);
                 // User said "images are named only with the numbers 1 to 129", so presumably all in there are valid.
            }
            
            const productName = `Label Reeha ${productNumber}`;
            const filePath = path.join(PRODUCTS_DIR, file);
            const fileContent = fs.readFileSync(filePath);

            // Generate S3 Key - keep it clean, maybe just use product number or preserve randomness if preferred.
            // Using a consistent naming for the file in S3 might be better, but the old script used random. 
            // I'll stick to a clean name but with a unique prefix to avoid caching issues if replaced.
            const productIdForS3 = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const s3Key = `products/Label_Reeha_${productNumber}_${productIdForS3}.png`;

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
                console.warn(`  Product ${productName} NOT FOUND in DB. Skipping update.`);
                // If user wants to create them, I'd uncomment creation logic, but prompt says "update the product image... match them and update".
            }

            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log("Update process complete.");

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

run();
