const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            throw error;
        }

        return res.status(200).json(testimonials || []);

    } catch (err) {
        console.error("Supabase Error:", err);
        return res.status(500).json({ error: 'Failed to fetch testimonials', details: err.message });
    }
}
