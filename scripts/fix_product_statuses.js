const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web-app/.env.local') });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const rawDataPath = path.join(__dirname, '../raw_status_list.txt');
    const data = fs.readFileSync(rawDataPath, 'utf8');
    const lines = data.split('\n').filter(l => l.trim() !== '');

    let updateCount = 0;

    for (const line of lines) {
        const parts = line.split('\t').map(p => p.trim());
        if (parts.length < 3) continue;

        let name = parts[0];
        // Handle variations like "LR-2" vs "LR 2"
        name = name.replace('-', ' ');
        // Translate "LR " to "Label Reeha "
        name = name.replace(/^LR\s+/i, 'Label Reeha ');

        const statusStr = parts[2].toUpperCase();

        let newStatus = 'Available';
        if (statusStr.includes('SOLD')) {
            newStatus = 'Sold Out';
        }

        const { data: products, error } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', name); // Use case-insensitive match just in case
            
        if (error) {
            console.error(`Error fetching ${name}:`, error.message);
            continue;
        }
        
        if (products && products.length > 0) {
            const product = products[0];
            const { error: updateError } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', product.id);
                
            if (updateError) {
                console.error(`Failed to update ${name}:`, updateError.message);
            } else {
                console.log(`Updated ${name} to ${newStatus}`);
                updateCount++;
            }
        } else {
            console.log(`Product not found in DB: ${name}`);
        }
    }
    
    console.log(`Finished updating ${updateCount} products.`);
}

main();
