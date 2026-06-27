"use server";

import { supabase } from "@/lib/db";

export async function getTestimonials() {
    try {
        const { data: items, error } = await supabase
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
