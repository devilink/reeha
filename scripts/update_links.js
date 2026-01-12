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
            if (key) {
                process.env[key] = val;
            }
        }
    });
    console.log("Loaded .env fields");
} catch (e) {
    console.log("Could not load .env:", e.message);
}

AWS.config.update({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

const links = [
    "https://www.facebook.com/photo.php?fbid=122174298272795406&set=pb.61573862192594.-2207520000&type=3",
    "https://www.facebook.com/reel/1165898105330696",
    "https://www.facebook.com/photo?fbid=122173087148795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/reel/1195725472013940",
    "https://www.facebook.com/photo?fbid=122171961554795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo?fbid=122171218790795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo?fbid=122171028632795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122170605266795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169880580795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169785528795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169225194795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028550795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028310795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028202795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028046795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027866795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027770795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027590795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027464795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027308795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027122795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956976795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956856795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956676795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956544795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956388795406&set=pb.61573862192594.-2207520000"
];

const startProduct = 95;

async function updateProduct(id, productName, fbUrl) {
    const params = {
        TableName: 'Products',
        Key: {
            "id": id
        },
        UpdateExpression: "set fbUrl = :f",
        ExpressionAttributeValues: {
            ":f": fbUrl
        },
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
        // 1. Fetch all products to build name -> id map
        const data = await docClient.scan({ TableName: 'Products' }).promise();
        const products = data.Items || [];
        const nameToId = {};
        products.forEach(p => {
            if (p.name) nameToId[p.name] = p.id;
        });

        console.log(`Found ${products.length} products.`);

        // 2. Iterate and update
        console.log(`Starting update for ${links.length} products...`);

        for (let i = 0; i < links.length; i++) {
            const productNumber = startProduct + i;
            const productName = `Label Reeha ${productNumber}`;
            const fbUrl = links[i];

            const id = nameToId[productName];

            if (!id) {
                console.warn(`Product not found: ${productName}, skipping.`);
                continue;
            }

            await updateProduct(id, productName, fbUrl);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (err) {
        console.error("Critical Error during process:", err);
    }

    console.log("All updates completed.");
}

run();
