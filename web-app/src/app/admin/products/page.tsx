import { getProducts } from "@/actions/getProducts";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import { ArrowLeft } from "lucide-react";

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

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs uppercase text-gray-500 font-bold">Image</th>
                                <th className="p-4 text-xs uppercase text-gray-500 font-bold">Name</th>
                                <th className="p-4 text-xs uppercase text-gray-500 font-bold">Price</th>
                                <th className="p-4 text-xs uppercase text-gray-500 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                                            {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-brand-dark">{product.name}</td>
                                    <td className="p-4">₹{product.price}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3 text-gray-500">
                                            <button className="hover:text-blue-600"><Edit size={18} /></button>
                                            <button className="hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No products found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
