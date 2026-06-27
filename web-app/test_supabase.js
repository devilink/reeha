
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    console.log("Fetching products...");
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Found ${data.length} products.`);
        if (data.length > 0) {
            console.log("First product:", data[0]);
        }
    }
}
test();
