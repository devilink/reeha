const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Load .env
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

const docClient = new AWS.DynamoDB.DocumentClient();

async function verify() {
    console.log("Verifying products...");
    const names = ["Label Reeha 127", "Label Reeha 128"];

    for (const name of names) {
        const params = {
            TableName: 'Products',
            FilterExpression: "#n = :name",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":name": name }
        };

        try {
            const result = await docClient.scan(params).promise();
            if (result.Items && result.Items.length > 0) {
                console.log(`FOUND ${name}:`);
                console.log(JSON.stringify(result.Items[0], null, 2));
            } else {
                console.log(`MISSING ${name}`);
            }
        } catch (err) {
            console.error(`Error fetching ${name}:`, err.message);
        }
    }
}

verify();
