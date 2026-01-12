const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

try {
    const envPath = path.resolve(__dirname, '../.env');
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            process.env[key] = val;
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

const dynamodb = new AWS.DynamoDB();

async function run() {
    try {
        const data = await dynamodb.describeTable({ TableName: 'Products' }).promise();
        console.log("KeySchema:", JSON.stringify(data.Table.KeySchema, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
