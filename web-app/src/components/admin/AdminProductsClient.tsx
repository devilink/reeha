"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import { Product } from "@/types";
import { updateProductStatus } from "@/actions/product-actions";
import { useRouter } from "next/navigation";

interface AdminProductsClientProps {
    initialProducts: Product[];
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const filteredProducts = initialProducts.filter(p => {
        if (statusFilter === "All") return true;
        const pStatus = p.status || "Available"; // default if missing
        return pStatus === statusFilter;
    });

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        startTransition(async () => {
            try {
                await updateProductStatus(id, newStatus);
            } catch (err) {
                console.error("Failed to update status", err);
                alert("Failed to update status.");
            } finally {
                setUpdatingId(null);
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Filter Controls */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Filter Products:</span>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-gray-300 rounded-md text-sm pl-3 pr-8 py-1.5 focus:ring-brand-gold focus:border-brand-gold"
                >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Sold Out. We can recreate it.">Sold Out. We can recreate it.</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
                {isPending && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <span className="text-sm font-medium text-[#d4af37]">Updating...</span>
                    </div>
                )}
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-xs uppercase text-gray-500 font-bold">Image</th>
                            <th className="p-4 text-xs uppercase text-gray-500 font-bold">Name</th>
                            <th className="p-4 text-xs uppercase text-gray-500 font-bold">Price</th>
                            <th className="p-4 text-xs uppercase text-gray-500 font-bold w-48">Status</th>
                            <th className="p-4 text-xs uppercase text-gray-500 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-brand-dark">{product.name}</td>
                                <td className="p-4">₹{product.price}</td>
                                <td className="p-4">
                                    <select
                                        disabled={updatingId === product.id || isPending}
                                        value={product.status || "Available"}
                                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                                        className={`text-sm border-gray-300 rounded-md py-1 px-2 pr-8 focus:ring-brand-gold focus:border-brand-gold ${updatingId === product.id ? 'opacity-50' : ''}`}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Unavailable">Unavailable</option>
                                        <option value="Sold Out. We can recreate it.">Sold Out (Remake)</option>
                                    </select>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3 text-gray-500">
                                        {/* Edit icon placeholder until real edit page is built */}
                                        <button className="hover:text-blue-600 cursor-not-allowed opacity-50" title="Full edit coming soon"><Edit size={18} /></button>
                                        {/* Delete icon placeholder */}
                                        <button className="hover:text-red-500 cursor-not-allowed opacity-50"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No products match this filter.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
