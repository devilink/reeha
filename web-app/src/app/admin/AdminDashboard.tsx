"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { addProduct, updateProduct, deleteProduct } from "@/actions/admin";
import { Plus, Edit, Trash2, Settings, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        // AWS Config removed
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const form = new FormData(e.currentTarget);

        try {
            if (editingProduct) {
                form.append("id", editingProduct.id);
                form.append("currentImageUrl", editingProduct.imageUrl);
                if (editingProduct.createdAt) {
                    form.append("createdAt", editingProduct.createdAt);
                }
                const res = await updateProduct(form);
                if (res.success) {
                    alert("Product updated successfully!");
                    window.location.reload();
                }
            } else {
                const res = await addProduct(form);
                if (res.success) {
                    alert("Product added successfully!");
                    window.location.reload();
                }
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setIsLoading(true);
        try {
            const form = new FormData();
            form.append("id", id);

            await deleteProduct(form);
            alert("Product deleted!");
            window.location.reload();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setPreviewImage(null);
    };

    return (
        <div className="space-y-12">

            {/* Form Section */}
            <section className="bg-white p-8 rounded-lg shadow-md border border-[#eaeaea] relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex flex-col justify-center items-center">
                        <Loader2 className="animate-spin text-[#d4af37] w-12 h-12 mb-4" />
                        <p className="font-serif">Processing...</p>
                    </div>
                )}

                <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                    <Settings className="text-[#d4af37]" /> {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Product Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500">JPG, PNG (MAX. 5MB)</p>
                                </div>
                                <input name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!editingProduct} />
                            </label>
                        </div>
                        
                        {(previewImage || editingProduct?.imageUrl) && (
                            <div className="mt-4 p-2 border rounded max-w-xs">
                                <p className="text-xs font-bold text-gray-500 mb-2">Preview:</p>
                                <img src={previewImage || editingProduct?.imageUrl} alt="Preview" className="h-40 w-auto object-contain rounded" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Product Name</label>
                            <input name="name" defaultValue={editingProduct?.name || ""} type="text" className="w-full p-3 border rounded focus:outline-none focus:border-[#d4af37]" placeholder="e.g., Label Reeha-X" required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Price (₹)</label>
                            <input name="price" defaultValue={editingProduct?.price || ""} type="number" className="w-full p-3 border rounded focus:outline-none focus:border-[#d4af37]" placeholder="e.g., 1200" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Instagram Link</label>
                            <input name="instaUrl" defaultValue={editingProduct?.instaUrl || ""} type="url" className="w-full p-3 border rounded focus:outline-none focus:border-[#d4af37]" placeholder="https://instagram.com/p/..." required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Facebook Link</label>
                            <input name="fbUrl" defaultValue={editingProduct?.fbUrl || ""} type="url" className="w-full p-3 border rounded focus:outline-none focus:border-[#d4af37]" placeholder="https://facebook.com/..." required />
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-4 flex justify-between items-center">
                        {editingProduct ? (
                            <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-800 text-sm font-bold">Cancel Edit</button>
                        ) : <div></div>}
                        <button type="submit" className="bg-gradient-to-br from-[#b8860b] to-[#d4af37] text-white px-8 py-3 rounded font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                            {editingProduct ? "Update Product" : "Upload Product"} <Plus size={18} />
                        </button>
                    </div>
                </form>
            </section>

            {/* Product List */}
            <section className="bg-white p-8 rounded-lg shadow-md border border-[#eaeaea]">
                <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                    <Settings className="text-[#d4af37]" /> Product List
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="text-xs uppercase text-gray-400 border-b">
                                <th className="py-3">Image</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Price</th>
                                <th className="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">No products found.</td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3">
                                            <div className="w-12 h-12 relative border rounded bg-gray-50">
                                                <Image src={p.imageUrl} alt={p.name} fill className="object-cover rounded" />
                                            </div>
                                        </td>
                                        <td className="py-3 font-medium">{p.name}</td>
                                        <td className="py-3">₹{p.price}</td>
                                        <td className="py-3 text-right space-x-4">
                                            <button onClick={() => { setEditingProduct(p); setPreviewImage(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
