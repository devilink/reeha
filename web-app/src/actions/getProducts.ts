import { supabaseAdmin } from "@/lib/db";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
    try {
        const { data: items, error } = await supabaseAdmin
            .from('products')
            .select('*');

        if (error) throw error;
        
        let products = (items || []) as Product[];
        products.sort((a, b) => {
            return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
        });

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
