const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

AWS.config.update({
    region: AWS_CONFIG.region,
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function check() {
    // Check a few products that should have been processed by now (100, 101, etc.)
    const checkList = ['Label Reeha 100', 'Label Reeha 101', 'Label Reeha 1'];

    for (const name of checkList) {
        // We need to scan or query GSI if name is not PK.
        // Based on previous script, PK is 'id'. name is an attribute.
        // We'll scan filtering by name (inefficient but fine for check)
        const params = {
            TableName: AWS_CONFIG.tableName,
            FilterExpression: "#n = :v",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":v": name }
        };

        try {
            const data = await docClient.scan(params).promise();
            if (data.Items && data.Items.length > 0) {
                const item = data.Items[0];
                console.log(`Product: ${item.name}`);
                console.log(`  ID: ${item.id}`);
                console.log(`  Image URL: ${item.imageUrl}`);
                if (item.imageUrl.includes('Label_Reeha')) {
                    console.log("  VERIFICATION PASSED: Image URL contains expected pattern.");
                } else {
                    console.log("  VERIFICATION FAILED: Image URL does NOT contain new pattern.");
                }
            } else {
                console.log(`Product ${name} NOT FOUND.`);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

check();
