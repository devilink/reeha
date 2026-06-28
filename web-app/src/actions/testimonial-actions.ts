"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { checkAdmin } from "@/lib/auth";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function addTestimonial(formData: FormData) {
    await checkAdmin();

    const name = formData.get("name") as string || "";
    const designation = formData.get("designation") as string || "";
    const quote = formData.get("quote") as string || "";
    const type = formData.get("type") as string || "testimonial";
    const file = formData.get("media") as File;

    if (!file || file.size === 0) {
        throw new Error("Missing required field (Media is required)");
    }

    const testimonialId = `testi_${Date.now()}`;
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `testimonials/${testimonialId}.${fileExtension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
        .from('label-reeha-images')
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
        .from('label-reeha-images')
        .getPublicUrl(fileName);
        
    const imageUrl = publicUrlData.publicUrl;

    const testimonial = {
        id: randomUUID(),
        name,
        designation: designation || null,
        quote,
        imageUrl,
        type,
        createdAt: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from('testimonials').insert(testimonial);
    if (error) throw error;

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    redirect("/admin/testimonials");
}

export async function updateTestimonial(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string || "";
    const designation = formData.get("designation") as string || "";
    const quote = formData.get("quote") as string || "";
    const type = formData.get("type") as string || "testimonial";
    let imageUrl = formData.get("currentImageUrl") as string;
    const file = formData.get("media") as File | null;

    if (!id) throw new Error("Missing ID");

    // If a new file is uploaded, upload it to Supabase and get the new URL
    if (file && file.size > 0) {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `testimonials/${id}_update_${Date.now()}.${fileExtension}`;
        
        const { error: uploadError } = await supabaseAdmin.storage
            .from('label-reeha-images')
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseAdmin.storage
            .from('label-reeha-images')
            .getPublicUrl(fileName);
            
        imageUrl = publicUrlData.publicUrl;
    }

    const { error: dbError } = await supabaseAdmin
        .from('testimonials')
        .upsert({
            id,
            name,
            designation: designation || null,
            quote,
            imageUrl,
            type,
            createdAt: formData.get("createdAt") as string || new Date().toISOString()
        });

    if (dbError) throw dbError;

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
    await checkAdmin();
    if (!id) throw new Error("Missing ID");

    const { error } = await supabaseAdmin
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
}
