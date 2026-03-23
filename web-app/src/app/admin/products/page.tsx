import { getProducts } from "@/actions/getProducts";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

// For now, this is a server component listing products. 
// Delete functionality needs a Client Component or Server Action with form.
// I'll create a DeleteProductButton next.

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif text-brand-dark">Product Management</h1>
                    <Link href="/admin/products/new" className="px-6 py-2 bg-brand-gold text-white rounded-md font-bold text-sm uppercase hover:bg-black transition-colors">
                        + Add New Product
                    </Link>
                </div>

                <Link href="/admin" className="inline-flex items-center text-gray-500 mb-6 hover:text-brand-dark">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                <AdminProductsClient initialProducts={products} />
            </div>
        </div>
    );
}
