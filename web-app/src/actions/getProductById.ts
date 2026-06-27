import { supabase } from "@/lib/db";
import { Product } from "@/types";

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const { data: item, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // not found
            throw error;
        }
        return (item as Product) || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
