"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteTestimonial } from "@/actions/testimonial-actions";

export default function AdminTestimonialsClient({ initialTestimonials }: { initialTestimonials: {id: string; imageUrl: string; name: string; designation: string; quote: string; type?: string;}[] }) {
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>("All");

    const filteredTestimonials = testimonials.filter(t => typeFilter === "All" || (t.type || "testimonial") === typeFilter);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        setIsDeleting(id);
        try {
            await deleteTestimonial(id);
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete testimonial.");
        } finally {
            setIsDeleting(null);
        }
    };

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|mov)$/i);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <h2 className="text-xl font-serif text-brand-dark">Uploaded Media</h2>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="p-2 text-sm border-gray-300 rounded focus:border-brand-gold focus:ring-brand-gold bg-white border outline-none"
                >
                    <option value="All">All Types</option>
                    <option value="testimonial">Testimonials</option>
                    <option value="social_proof">Social Media Proofs</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-y border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Media</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quote</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTestimonials.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No media found.
                                </td>
                            </tr>
                        ) : (
                            filteredTestimonials.map((testi) => (
                                <tr key={testi.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 relative">
                                            {isVideo(testi.imageUrl) ? (
                                                <video src={testi.imageUrl} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <Image src={testi.imageUrl} alt={testi.name} fill className="object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${(testi.type || 'testimonial') === 'testimonial' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {(testi.type || 'testimonial') === 'testimonial' ? 'Testimonial' : 'Social Proof'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{testi.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-500 text-sm">{testi.designation || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-500 text-sm line-clamp-2 max-w-xs">{testi.quote}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/testimonials/edit/${testi.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            title="Edit Testimonial"
                                        >
                                            <Edit size={18} className="inline" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(testi.id)}
                                            disabled={isDeleting === testi.id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 inline"
                                            title="Delete Testimonial"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
