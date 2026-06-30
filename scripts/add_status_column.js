const { Client } = require('pg');

const SUPABASE_DB_URL = 'postgresql://postgres:Bloodking005%23istherealking@db.ykuynhasvslylybksdnp.supabase.co:5432/postgres';

async function main() {
    const pgClient = new Client({ connectionString: SUPABASE_DB_URL });
    await pgClient.connect();
    console.log("Connected to Postgres");

    try {
        await pgClient.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Available';`);
        console.log("Successfully added status column to products table.");
    } catch (e) {
        console.error("Error adding status column:", e);
    }

    await pgClient.end();
}
main();
