const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web-app/.env.local') });
const { createClient } = require('@supabase/supabase-js');
const AWS = require('aws-sdk');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

AWS.config.update({
    region: process.env.AWS_REGION || 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.AWS_DYNAMODB_TABLE || 'Products';

async function main() {
    console.log("Fetching all products from DynamoDB...");
    try {
        const data = await docClient.scan({ TableName: tableName }).promise();
        const dynamoProducts = data.Items || [];
        console.log(`Found ${dynamoProducts.length} products in DynamoDB.`);

        let updateCount = 0;

        for (const dp of dynamoProducts) {
            // We want to update Supabase. Find product by name.
            const name = dp.name;
            const dynamoStatus = dp.status || 'Available'; 
            // In the DynamoDB, the raw status might be 'SOLD', 'AVAILABLE', 'SOLD (REMAKE)'.
            // Wait, we need to check what the status actually is in DynamoDB!
            // First, let's just log what the status string is in DynamoDB for a few products:
            
            // Map them to the original strings if they are uppercase in DynamoDB.
            let targetStatus = "Available";
            if (dynamoStatus === "SOLD" || dynamoStatus === "Unavailable") {
                targetStatus = "Unavailable";
            } else if (dynamoStatus === "SOLD (REMAKE)" || dynamoStatus === "Sold Out. We can recreate it.") {
                targetStatus = "Sold Out. We can recreate it.";
            } else if (dynamoStatus === "AVAILABLE" || dynamoStatus === "Available") {
                targetStatus = "Available";
            } else {
                targetStatus = dynamoStatus; // Fallback
            }

            const { data: supabaseProducts, error } = await supabase
                .from('products')
                .select('id, name, status')
                .ilike('name', name);
                
            if (error) {
                console.error(`Error fetching ${name} from Supabase:`, error.message);
                continue;
            }
            
            if (supabaseProducts && supabaseProducts.length > 0) {
                const sp = supabaseProducts[0];
                if (sp.status !== targetStatus) {
                    const { error: updateError } = await supabase
                        .from('products')
                        .update({ status: targetStatus })
                        .eq('id', sp.id);
                        
                    if (updateError) {
                        console.error(`Failed to update ${name}:`, updateError.message);
                    } else {
                        console.log(`Updated ${name} in Supabase from "${sp.status}" to "${targetStatus}"`);
                        updateCount++;
                    }
                }
            } else {
                console.log(`Product not found in Supabase: ${name}`);
            }
        }
        
        console.log(`Finished checking all DynamoDB products. Updated ${updateCount} statuses in Supabase.`);
    } catch (err) {
        console.error("Error accessing DynamoDB:", err);
    }
}

main();
