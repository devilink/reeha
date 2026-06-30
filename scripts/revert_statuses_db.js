const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web-app/.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Revert "SOLD" -> "Unavailable"
    const { error: e1 } = await supabase
        .from('products')
        .update({ status: 'Unavailable' })
        .eq('status', 'SOLD');
    console.log("Reverted SOLD to Unavailable", e1 || "Success");

    // Revert "SOLD (REMAKE)" -> "Sold Out. We can recreate it."
    const { error: e2 } = await supabase
        .from('products')
        .update({ status: 'Sold Out. We can recreate it.' })
        .eq('status', 'SOLD (REMAKE)');
    console.log("Reverted SOLD (REMAKE) to Sold Out. We can recreate it.", e2 || "Success");

    // Revert "AVAILABLE" -> "Available"
    const { error: e3 } = await supabase
        .from('products')
        .update({ status: 'Available' })
        .eq('status', 'AVAILABLE');
    console.log("Reverted AVAILABLE to Available", e3 || "Success");
}

main();
