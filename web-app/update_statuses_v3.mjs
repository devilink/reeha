import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key && !process.env[key]) {
                process.env[key] = val;
            }
        }
    });
    console.log("Loaded .env.local fields");
} catch (e) {
    console.log("Could not load .env.local:", e.message);
}

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AWS_TABLE_NAME || "Products";

function parseStatusList(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const updates = [];

    lines.forEach(line => {
        if (!line.trim()) return;

        const match = line.match(/^LR[-\s]*(\d+)\s+(\d+)\s+(.+)$/i);

        if (match) {
            const num = match[1];
            let rawStatus = match[3].trim().toUpperCase(); 

            let finalStatus = "Available"; 

            if (rawStatus === 'SOLD') {
                finalStatus = "Unavailable";
            } else if (rawStatus.includes('SOLD') && rawStatus.includes('REMAKE')) {
                finalStatus = "Sold Out. We can recreate it.";
            } else if (rawStatus === 'AVAILABLE') {
                finalStatus = "Available";
            } else {
                if (match[3].toLowerCase().includes('sold')) finalStatus = "Unavailable";
            }

            updates.push({
                productName: `Label Reeha ${num}`,
                status: finalStatus
            });
        }
    });
    return updates;
}

async function updateProduct(id, productName, status) {
    const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status }
    };

    try {
        await docClient.send(new UpdateCommand(params));
        console.log(`Updated ${productName}: ${status}`);
    } catch (err) {
        console.error(`Error updating ${productName} (ID: ${id}):`, err.message);
    }
}

async function run() {
    console.log("Parsing status list...");
    const rawStatusPath = path.resolve(__dirname, '../raw_status_list.txt');
    const updates = parseStatusList(rawStatusPath);
    console.log(`Parsed ${updates.length} updates.`);

    console.log(`Fetching all products to map names to IDs...`);
    try {
        const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
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
            await new Promise(r => setTimeout(r, 50));
            successCount++;
        }

        console.log(`\nComplete. Success: ${successCount}, Not Found in DB: ${failCount}`);

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

run();
