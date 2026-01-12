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
        console.log("Fetching products 95-115...");
        const start = 95;
        const end = 115;
        const names = [];
        for (let i = start; i <= end; i++) {
            names.push(`Label Reeha ${i}`);
        }

        // We'll scan and filter locally since DynamoDB batchGet needs keys, and we only know names (which are not keys anymore, ID is key)
        const data = await docClient.scan({ TableName: 'Products' }).promise();
        const products = data.Items || [];

        const filtered = products.filter(p => names.includes(p.name));

        filtered.sort((a, b) => {
            const numA = parseInt(a.name.replace("Label Reeha ", ""));
            const numB = parseInt(b.name.replace("Label Reeha ", ""));
            return numA - numB;
        });

        filtered.forEach(p => {
            console.log(`${p.name}: ${p.fbUrl}`);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

run();
