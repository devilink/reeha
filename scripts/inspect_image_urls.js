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

async function run() {
    try {
        console.log("Fetching products 95 and 120...");
        const names = ["Label Reeha 95", "Label Reeha 120"];

        const data = await docClient.scan({ TableName: 'Products' }).promise();
        const products = data.Items || [];

        const filtered = products.filter(p => names.includes(p.name));

        filtered.forEach(p => {
            console.log(`\nName: ${p.name}`);
            console.log(`imageUrl: ${p.imageUrl}`);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

run();
