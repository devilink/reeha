import { getProducts } from "@/actions/getProducts";
import ShopClient from "@/components/ShopClient";

export const revalidate = 60;

export default async function ShopPage() {
    const products = await getProducts();
    return <ShopClient initialProducts={products} />;
}
