const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web-app/.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data, error } = await supabase
        .from('products')
        .select('status');
    
    if (error) {
        console.error("Error fetching statuses:", error);
        return;
    }

    const distinctStatuses = [...new Set(data.map(p => p.status))];
    console.log("Distinct statuses in DB:", distinctStatuses);
}

main();
