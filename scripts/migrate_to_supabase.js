const AWS = require('aws-sdk');
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ykuynhasvslylybksdnp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdXluaGFzdnNseWx5YmtzZG5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4MTUzNiwiZXhwIjoyMDk4MTU3NTM2fQ.m0-R2wlsTGcsH0p2rk41IaXy0M7e9J7BRkBgDAxHikU';
const SUPABASE_DB_URL = 'postgresql://postgres:Bloodking005%23istherealking@db.ykuynhasvslylybksdnp.supabase.co:5432/postgres';

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const pgClient = new Client({ connectionString: SUPABASE_DB_URL });

const BUCKET_NAME = 'label-reeha-images';

async function migrate() {
    console.log("🚀 Starting Migration...");
    await pgClient.connect();

    // 1. CREATE TABLES
    console.log("📦 Creating Postgres Tables...");
    await pgClient.query(`
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price INTEGER NOT NULL,
            "imageUrl" TEXT,
            "instaUrl" TEXT,
            "fbUrl" TEXT,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);
    await pgClient.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            designation VARCHAR(255),
            quote TEXT,
            "imageUrl" TEXT,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `);
    console.log("✅ Tables created.");

    // 2. CREATE STORAGE BUCKET
    console.log("🪣 Creating Supabase Storage Bucket...");
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    const bucketExists = buckets && buckets.some(b => b.name === BUCKET_NAME);
    if (!bucketExists) {
        const { error: createBucketErr } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
        if (createBucketErr) console.error("Error creating bucket:", createBucketErr.message);
        else console.log(`✅ Bucket '${BUCKET_NAME}' created.`);
    } else {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
    }

    // 3. MIGRATE PRODUCTS
    console.log("📦 Migrating Products...");
    const productsData = await dynamodb.scan({ TableName: 'Products' }).promise();
    const products = productsData.Items || [];
    
    for (const p of products) {
        let newImageUrl = p.imageUrl;
        if (p.imageUrl && p.imageUrl.includes('amazonaws.com')) {
            // Extract object key from S3 URL
            const urlObj = new URL(p.imageUrl);
            let s3Key = decodeURIComponent(urlObj.pathname.substring(1)); // remove leading slash
            if (s3Key.startsWith('label-reeha-shop-images/')) {
                 s3Key = s3Key.replace('label-reeha-shop-images/', '');
            }

            console.log(`Downloading ${s3Key} from S3...`);
            try {
                const s3Obj = await s3.getObject({ Bucket: 'label-reeha-shop-images', Key: s3Key }).promise();
                
                // Upload to Supabase Storage
                console.log(`Uploading ${s3Key} to Supabase...`);
                const { data: uploadData, error: uploadErr } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(s3Key, s3Obj.Body, {
                        contentType: s3Obj.ContentType,
                        upsert: true
                    });
                
                if (uploadErr) throw uploadErr;

                // Get public URL
                const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(s3Key);
                newImageUrl = publicUrlData.publicUrl;
            } catch (e) {
                console.error(`❌ Error migrating image ${s3Key}:`, e.message);
            }
        }

        // Insert into Postgres
        const insertQuery = `
            INSERT INTO products (id, name, price, "imageUrl", "instaUrl", "fbUrl", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING;
        `;
        const values = [p.id, p.name, p.price || 0, newImageUrl, p.instaUrl || null, p.fbUrl || null, p.createdAt ? new Date(p.createdAt) : new Date()];
        await pgClient.query(insertQuery, values);
    }
    console.log(`✅ Migrated ${products.length} Products.`);

    // 4. MIGRATE TESTIMONIALS
    console.log("💬 Migrating Testimonials...");
    try {
        const testiData = await dynamodb.scan({ TableName: 'Testimonials' }).promise();
        const testimonials = testiData.Items || [];
        
        for (const t of testimonials) {
            let newImageUrl = t.imageUrl;
            if (t.imageUrl && t.imageUrl.includes('amazonaws.com')) {
                // Extract object key from S3 URL
                const urlObj = new URL(t.imageUrl);
                let s3Key = decodeURIComponent(urlObj.pathname.substring(1)); 
                if (s3Key.startsWith('label-reeha-shop-images/')) {
                     s3Key = s3Key.replace('label-reeha-shop-images/', '');
                }

                console.log(`Downloading ${s3Key} from S3...`);
                try {
                    const s3Obj = await s3.getObject({ Bucket: 'label-reeha-shop-images', Key: s3Key }).promise();
                    
                    // Upload to Supabase Storage
                    console.log(`Uploading ${s3Key} to Supabase...`);
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from(BUCKET_NAME)
                        .upload(s3Key, s3Obj.Body, {
                            contentType: s3Obj.ContentType,
                            upsert: true
                        });
                    
                    if (uploadErr) throw uploadErr;

                    // Get public URL
                    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(s3Key);
                    newImageUrl = publicUrlData.publicUrl;
                } catch (e) {
                    console.error(`❌ Error migrating image ${s3Key}:`, e.message);
                }
            }

            // Insert into Postgres
            const insertQuery = `
                INSERT INTO testimonials (id, name, designation, quote, "imageUrl", "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING;
            `;
            const values = [t.id, t.name, t.designation || null, t.quote || null, newImageUrl, t.createdAt ? new Date(t.createdAt) : new Date()];
            await pgClient.query(insertQuery, values);
        }
        console.log(`✅ Migrated ${testimonials.length} Testimonials.`);
    } catch (e) {
        if (e.code === 'ResourceNotFoundException') {
            console.log("⚠️ Testimonials table not found in AWS, skipping...");
        } else {
            console.error("❌ Error migrating testimonials:", e);
        }
    }

    await pgClient.end();
    console.log("🎉 Migration Complete!");
}

migrate().catch(console.error);
