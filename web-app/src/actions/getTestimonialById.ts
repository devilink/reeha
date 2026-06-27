"use server";

import { supabase } from "@/lib/db";

export async function getTestimonialById(id: string) {
    if (!id) throw new Error("ID is required");

    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error("Failed to fetch testimonial: " + error.message);
    }

    return data;
}
