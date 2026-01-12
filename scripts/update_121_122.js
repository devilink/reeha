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

const updates = [
    {
        name: "Label Reeha 121",
        instaUrl: "https://www.instagram.com/reel/DTZny9aj1-m/?igsh=dHJoNnJ3Zm02M2Ns",
        fbUrl: "https://www.facebook.com/reel/"
    },
    {
        name: "Label Reeha 122",
        instaUrl: "https://www.instagram.com/p/DTatyNoj93_/?img_index=1&igsh=Y2hoY2xlNDhlamhm",
        fbUrl: "https://www.facebook.com/photo.php?fbid=122174424944795406&set=pb.61573862192594.-2207520000&type=3"
    }
];

async function updateProduct(productName, instaUrl, fbUrl) {
    // 1. Get ID by name
    const data = await docClient.scan({
        TableName: 'Products',
        FilterExpression: "#name = :n",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":n": productName }
    }).promise();

    const product = data.Items && data.Items[0];

    if (!product) {
        console.log(`Product NOT FOUND: ${productName}`);
        return;
    }

    const id = product.id;

    // 2. Update
    const params = {
        TableName: 'Products',
        Key: { "id": id },
        UpdateExpression: "set instaUrl = :i, fbUrl = :f",
        ExpressionAttributeValues: {
            ":i": instaUrl,
            ":f": fbUrl
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        await docClient.update(params).promise();
        console.log(`Successfully updated ${productName} (ID: ${id})`);
    } catch (err) {
        console.error(`Error updating ${productName}:`, err.message);
    }
}

async function run() {
    for (const u of updates) {
        await updateProduct(u.name, u.instaUrl, u.fbUrl);
    }
    console.log("Done.");
}

run();
