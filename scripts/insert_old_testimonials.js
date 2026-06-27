const { Client } = require('pg');
const { randomUUID } = require('crypto');

const SUPABASE_DB_URL = 'postgresql://postgres:Bloodking005%23istherealking@db.ykuynhasvslylybksdnp.supabase.co:5432/postgres';

const testimonials = [
    {
        name: "Niharika Gohain",
        designation: "Assam",
        quote: "As a true handloom lover... this beautifully handcrafted jewelry from Label Reeha won my heart. I highly recommend to each one to buy from them.",
        imageUrl: "/Assets/testi1.jpeg"
    },
    {
        name: "Jafrina Yesmin",
        designation: "UK",
        quote: "What I appreciate is how versatile it is – it pairs perfectly with both western outfits and traditional Indian attire, making it a great choice for everyday wear as well as special occasions. Thanks Bini!",
        imageUrl: "/Assets/testi2.jpeg"
    },
    {
        name: "Seema Sharma -Partner",
        designation: "Versatilis Legal LLP, Delhi",
        quote: "I had the pleasure of wearing stunning earrings and necklaces crafted from the stencils of paat, muga and eri silks, a cherished Assamese textile tradition from Label Reeha , during a recent event of mine. The pieces beautifully blend the intricate weaves of Assamese handloom with elegant jewelry design, offering a unique fusion of cultural heritage and modern sophistication perfect for both everyday wear and special occasions.",
        imageUrl: "/Assets/testi3.jpeg"
    }
];

async function insertTestimonials() {
    const pgClient = new Client({ connectionString: SUPABASE_DB_URL });
    await pgClient.connect();

    console.log("Inserting old testimonials...");

    for (const t of testimonials) {
        const insertQuery = `
            INSERT INTO testimonials (id, name, designation, quote, "imageUrl", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [randomUUID(), t.name, t.designation, t.quote, t.imageUrl, new Date()];
        await pgClient.query(insertQuery, values);
    }

    console.log("Old testimonials inserted.");
    await pgClient.end();
}

insertTestimonials().catch(console.error);
