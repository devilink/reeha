"use server";

import { supabaseAdmin } from "@/lib/db";

export async function getTestimonials() {
    try {
        const { data: items, error } = await supabaseAdmin
            .from('testimonials')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        
        return items || [];
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
}