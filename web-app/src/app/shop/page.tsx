import { getProducts } from "@/actions/getProducts";
import ShopClient from "@/components/ShopClient";

export const revalidate = 60; // cached for 60 seconds

export default async function ShopPage() {
    const products = await getProducts();
    return <ShopClient initialProducts={products} />;
}
