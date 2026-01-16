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

function parseStatusList(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const updates = [];

    lines.forEach(line => {
        if (!line.trim()) return;

        // Flexible regex to handle "LR 1", "LR-2", "LR  3" etc.
        // Captures: 1: Number, 2: Price, 3: Status (rest of string)
        const match = line.match(/^LR[-\s]*(\d+)\s+(\d+)\s+(.+)$/i);

        if (match) {
            const num = match[1];
            const price = match[2];
            let rawStatus = match[3].trim().toUpperCase(); // Normalize for comparison

            let finalStatus = "Available"; // Default

            if (rawStatus === 'SOLD') {
                finalStatus = "Unavailable";
            } else if (rawStatus.includes('SOLD') && rawStatus.includes('REMAKE')) {
                // Handles "SOLD (REMAKE)", "SOLD ( REMAKE)", "SOLD (REMAKE) "
                finalStatus = "Sold Out. We can recreate it.";
            } else if (rawStatus === 'AVAILABLE') {
                finalStatus = "Available";
            } else {
                // Fallback if something else
                console.warn(`Unrecognized status: '${match[3]}' for LR ${num}, defaulting to converting as-is or checking.`);
                if (match[3].toLowerCase().includes('sold')) finalStatus = "Unavailable";
            }

            updates.push({
                productName: `Label Reeha ${num}`, // Construct full name
                status: finalStatus
            });
        }
    });
    return updates;
}

async function updateProduct(id, productName, status) {
    const params = {
        TableName: 'Products',
        Key: {
            "id": id
        },
        UpdateExpression: "set #s = :s",
        ExpressionAttributeNames: {
            "#s": "status" // Use placeholder to avoid reserved word conflicts (though status isn't strictly reserved in DDB, it's safe)
        },
        ExpressionAttributeValues: {
            ":s": status
        }
    };

    try {
        await docClient.update(params).promise();
        console.log(`Updated ${productName}: ${status}`);
    } catch (err) {
        console.error(`Error updating ${productName} (ID: ${id}):`, err.message);
    }
}

async function run() {
    console.log("Parsing status list...");
    const updates = parseStatusList(path.join(__dirname, '../raw_status_list.txt'));
    console.log(`Parsed ${updates.length} updates.`);

    console.log(`Fetching all products to map names to IDs...`);
    try {
        const data = await docClient.scan({ TableName: 'Products' }).promise();
        const products = data.Items || [];
        const nameToId = {};
        products.forEach(p => {
            if (p.name) nameToId[p.name] = p.id;
        });

        console.log(`Found ${products.length} products in DB.`);

        let successCount = 0;
        let failCount = 0;

        for (const update of updates) {
            const id = nameToId[update.productName];
            if (!id) {
                console.warn(`Product not found in DB: ${update.productName}`);
                failCount++;
                continue;
            }

            await updateProduct(id, update.productName, update.status);
            // Small delay to avoid throttling if provisioned throughput is low
            await new Promise(r => setTimeout(r, 50));
            successCount++;
        }

        console.log(`\nComplete. Success: ${successCount}, Not Found in DB: ${failCount}`);

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

run();
