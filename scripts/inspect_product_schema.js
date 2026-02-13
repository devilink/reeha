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

async function run() {
    try {
        const data = await docClient.scan({ TableName: 'Products', Limit: 1 }).promise();
        if (data.Items && data.Items.length > 0) {
            const output = {
                keys: Object.keys(data.Items[0]),
                sample: data.Items[0]
            };
            fs.writeFileSync('product_schema.json', JSON.stringify(output, null, 2));
            console.log("Written to product_schema.json");
        } else {
            console.log("No products found.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
