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

AWS.config.update({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

const targetLink = "https://www.facebook.com/label.reeha";
const startProduct = 90;
const endProduct = 94;

async function updateProduct(id, productName, fbUrl) {
    const params = {
        TableName: 'Products',
        Key: { "id": id },
        UpdateExpression: "set fbUrl = :f",
        ExpressionAttributeValues: { ":f": fbUrl },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await docClient.update(params).promise();
        console.log(`Successfully updated ${productName} (ID: ${id})`);
    } catch (err) {
        console.error(`Error updating ${productName} (ID: ${id}):`, err.message);
    }
}

async function run() {
    console.log(`Fetching all products to map names to IDs...`);

    try {
        const data = await docClient.scan({ TableName: 'Products' }).promise();
        const products = data.Items || [];
        const nameToId = {};
        products.forEach(p => {
            if (p.name) nameToId[p.name] = p.id;
        });

        console.log(`Found ${products.length} products.`);
        console.log(`Updating Label Reeha ${startProduct} to ${endProduct} with generic link...`);

        for (let i = startProduct; i <= endProduct; i++) {
            const productName = `Label Reeha ${i}`;
            const id = nameToId[productName];

            if (!id) {
                console.warn(`Product not found: ${productName}, skipping.`);
                continue;
            }

            await updateProduct(id, productName, targetLink);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (err) {
        console.error("Critical Error during process:", err);
    }

    console.log("All updates completed.");
}

run();
