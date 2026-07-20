"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function addProduct(formData: FormData) {
    await checkAdmin();

    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;
    const status = formData.get("status") as string || "Available";
    
    if (!file || !name || !price) {
        throw new Error("Missing required fields");
    }

    const productId = `prod_${Date.now()}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `products/${productId}.${fileExtension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
        .from('label-reeha-images')
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
        .from('label-reeha-images')
        .getPublicUrl(fileName);
        
    const imageUrl = publicUrlData.publicUrl;

    // Save to Postgres
    const { error: dbError } = await supabaseAdmin
        .from('products')
        .insert({
            id: productId,
            name,
            price,
            imageUrl,
            instaUrl,
            fbUrl,
            status,
            createdAt: new Date().toISOString()
        });

    if (dbError) throw dbError;

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true };
}

export async function updateProduct(formData: FormData) {
    await checkAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const instaUrl = formData.get("instaUrl") as string;
    const fbUrl = formData.get("fbUrl") as string;
    const status = formData.get("status") as string || "Available";
    let imageUrl = formData.get("currentImageUrl") as string;
    const file = formData.get("image") as File | null;

    if (!id || !name || !price) {
        throw new Error("Missing required fields");
    }

    if (file && file.size > 0) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `products/${id}_update_${Date.now()}.${fileExtension}`;
        
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
        .from('products')
        .upsert({
            id,
            name,
            price,
            imageUrl,
            instaUrl,
            fbUrl,
            status,
            createdAt: formData.get("createdAt") as string || new Date().toISOString()
        });

    if (dbError) throw dbError;

    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteProduct(formData: FormData) {
    await checkAdmin();
    
    const id = formData.get("id") as string;

    const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath("/shop");
    revalidatePath("/admin");
    return { success: true };
}
