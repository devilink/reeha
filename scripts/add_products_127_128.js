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

const PRODUCTS_TO_ADD = [
    {
        name: "Label Reeha 127",
        price: 1400,
        imagePath: path.resolve(__dirname, '../nim/Label Reeha 127.jpeg'),
        instaUrl: "https://www.instagram.com/reel/DTr0lf9j_Ry/?igsh=dGNxem4zNDdtdzd0",
        fbUrl: "https://www.facebook.com/share/r/17zCEqdmFx/"
    },
    {
        name: "Label Reeha 128",
        price: 1500,
        imagePath: path.resolve(__dirname, '../nim/Label Reeha 128.jpeg'),
        instaUrl: "https://www.instagram.com/reel/DTxHDoBjwdb/?igsh=ZGM0OHZvZWN3bTlz",
        fbUrl: "https://www.facebook.com/share/r/1YCz7ApWbR/"
    }
];

function getContentType(filename) {
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
    if (filename.endsWith('.png')) return 'image/png';
    return 'application/octet-stream';
}

async function run() {
    console.log("Starting product addition...");

    for (const prod of PRODUCTS_TO_ADD) {
        try {
            console.log(`Processing ${prod.name}...`);

            if (!fs.existsSync(prod.imagePath)) {
                console.error(`  Error: Image not found at ${prod.imagePath}`);
                continue;
            }

            // 1. Upload Image to S3
            const fileContent = fs.readFileSync(prod.imagePath);
            const fileName = path.basename(prod.imagePath);
            const productIdForS3 = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const s3Key = `products/${productIdForS3}_${fileName.replace(/\s+/g, '_')}`;

            const uploadParams = {
                Bucket: AWS_CONFIG.bucketName,
                Key: s3Key,
                Body: fileContent,
                ContentType: getContentType(fileName)
            };

            console.log(`  Uploading image to S3...`);
            const uploadResult = await s3.upload(uploadParams).promise();
            const imageUrl = uploadResult.Location;
            console.log(`  Uploaded: ${imageUrl}`);

            // 2. Add to DynamoDB
            // First check if it exists by scanning
            const scanParams = {
                TableName: AWS_CONFIG.tableName,
                FilterExpression: "#n = :name",
                ExpressionAttributeNames: { "#n": "name" },
                ExpressionAttributeValues: { ":name": prod.name }
            };

            const existing = await docClient.scan(scanParams).promise();

            if (existing.Items && existing.Items.length > 0) {
                const existingId = existing.Items[0].id;
                console.log(`  Product ${prod.name} already exists (ID: ${existingId}). Updating...`);

                await docClient.update({
                    TableName: AWS_CONFIG.tableName,
                    Key: { "id": existingId },
                    UpdateExpression: "set price = :p, instaUrl = :i, fbUrl = :f, imageUrl = :img",
                    ExpressionAttributeValues: {
                        ":p": prod.price,
                        ":i": prod.instaUrl,
                        ":f": prod.fbUrl,
                        ":img": imageUrl
                    },
                    ReturnValues: "UPDATED_NEW"
                }).promise();
                console.log(`  Updated successfully.`);

            } else {
                const newId = 'prod_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
                const newItem = {
                    id: newId,
                    name: prod.name,
                    price: prod.price,
                    imageUrl: imageUrl,
                    instaUrl: prod.instaUrl,
                    fbUrl: prod.fbUrl,
                    createdAt: new Date().toISOString(),
                    description: "Elegant jewelry for every occasion.", // Default
                    material: "Gold Plated" // Default
                };

                await docClient.put({
                    TableName: AWS_CONFIG.tableName,
                    Item: newItem
                }).promise();
                console.log(`  Created new product (ID: ${newId}).`);
            }

        } catch (err) {
            console.error(`  Error processing ${prod.name}:`, err);
        }
    }
}

run();
