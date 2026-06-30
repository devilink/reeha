const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../web-app/.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Fix all "Unavailable" -> "SOLD"
    const { data: d1, error: e1 } = await supabase
        .from('products')
        .update({ status: 'SOLD' })
        .eq('status', 'Unavailable');
    console.log("Updated Unavailable to SOLD", e1 || "Success");

    // Fix all "Sold Out. We can recreate it." -> "SOLD (REMAKE)"
    const { data: d2, error: e2 } = await supabase
        .from('products')
        .update({ status: 'SOLD (REMAKE)' })
        .eq('status', 'Sold Out. We can recreate it.');
    console.log("Updated Sold Out... to SOLD (REMAKE)", e2 || "Success");

    // Fix all "Sold Out" -> "SOLD"
    const { data: d3, error: e3 } = await supabase
        .from('products')
        .update({ status: 'SOLD' })
        .eq('status', 'Sold Out');
    console.log("Updated Sold Out to SOLD", e3 || "Success");

    // Fix all "Available" -> "AVAILABLE"
    const { data: d4, error: e4 } = await supabase
        .from('products')
        .update({ status: 'AVAILABLE' })
        .eq('status', 'Available');
    console.log("Updated Available to AVAILABLE", e4 || "Success");

    // Fix all "Sold Out (Remake)" -> "SOLD (REMAKE)"
    const { data: d5, error: e5 } = await supabase
        .from('products')
        .update({ status: 'SOLD (REMAKE)' })
        .eq('status', 'Sold Out (Remake)');
    console.log("Updated Sold Out (Remake) to SOLD (REMAKE)", e5 || "Success");
}

main();
