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
        const params = {
            TableName: 'Products',
            ExpressionAttributeValues: { ":n": "Label Reeha 90" },
            FilterExpression: "#name = :n"
        };

        const data = await docClient.scan(params).promise();
        data.Items.forEach(item => {
            console.log(`Product: ${item.name}`);
            console.log(`fbUrl: ${item.fbUrl}`);
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
