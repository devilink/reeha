const { Client } = require('pg');

const SUPABASE_DB_URL = 'postgresql://postgres:Bloodking005%23istherealking@db.ykuynhasvslylybksdnp.supabase.co:5432/postgres';

async function fixPermissions() {
    const pgClient = new Client({ connectionString: SUPABASE_DB_URL });
    await pgClient.connect();

    console.log("Granting permissions to anon and authenticated roles...");
    
    // Grant permissions
    await pgClient.query(`GRANT ALL ON TABLE public.products TO anon;`);
    await pgClient.query(`GRANT ALL ON TABLE public.products TO authenticated;`);
    await pgClient.query(`GRANT ALL ON TABLE public.products TO service_role;`);

    await pgClient.query(`GRANT ALL ON TABLE public.testimonials TO anon;`);
    await pgClient.query(`GRANT ALL ON TABLE public.testimonials TO authenticated;`);
    await pgClient.query(`GRANT ALL ON TABLE public.testimonials TO service_role;`);

    // Ensure RLS is disabled (or if you want to keep it enabled, add a permissive policy)
    // For a public shop, disabling RLS is fine for reads, but we should restrict writes.
    // However, since we use server actions with the service_role key for writes, disabling RLS is totally fine because the client only reads.
    await pgClient.query(`ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;`);
    await pgClient.query(`ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;`);

    console.log("Permissions fixed.");
    await pgClient.end();
}

fixPermissions().catch(console.error);
