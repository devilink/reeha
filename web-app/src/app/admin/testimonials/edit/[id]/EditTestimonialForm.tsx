"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateTestimonial } from "@/actions/testimonial-actions";
import Image from "next/image";

export default function EditTestimonialForm({ testimonial }: { testimonial: any }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [type, setType] = useState(testimonial.type || "testimonial");
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFileName(e.target.files[0].name);
        } else {
            setSelectedFileName(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            await updateTestimonial(formData);
            // redirect is handled in server action
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
            setLoading(false);
        }
    };

    const isVideo = testimonial.imageUrl?.match(/\.(mp4|webm|mov)$/i);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/testimonials" className="inline-flex items-center text-gray-500 mb-6 hover:text-brand-dark">
                    <ArrowLeft size={16} className="mr-2" /> Back to Testimonials
                </Link>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-serif text-brand-dark mb-6">Edit Testimonial</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="id" value={testimonial.id} />
                        <input type="hidden" name="currentImageUrl" value={testimonial.imageUrl} />
                        <input type="hidden" name="createdAt" value={testimonial.createdAt || new Date().toISOString()} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={testimonial.name}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors"
                                    placeholder="e.g. Niharika Gohain (Optional)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Designation / Location
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    defaultValue={testimonial.designation || ""}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors"
                                    placeholder="e.g. Assam or CEO (Optional)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                name="type"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors bg-white"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="testimonial">Testimonial</option>
                                <option value="social_proof">Social Media Proof</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quote
                            </label>
                            <textarea
                                name="quote"
                                rows={4}
                                defaultValue={testimonial.quote}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors"
                                placeholder="What did they say? (Optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Media
                            </label>
                            <div className="mb-4 h-48 w-full md:w-1/2 rounded-md overflow-hidden bg-black relative">
                                {isVideo ? (
                                    <video src={testimonial.imageUrl} className="w-full h-full object-contain" controls />
                                ) : (
                                    <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-contain" />
                                )}
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Replace Media (Leave empty to keep current)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-brand-gold transition-colors bg-gray-50">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="media"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-brand-gold hover:text-brand-dark focus-within:outline-none"
                                        >
                                            <span>{selectedFileName ? "Change file" : "Upload new file"}</span>
                                            <input id="media" name="media" type="file" accept={type === "testimonial" ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"} className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        {!selectedFileName && <p className="pl-1">or drag and drop</p>}
                                    </div>
                                    {selectedFileName ? (
                                        <p className="text-sm font-semibold text-brand-dark mt-2 truncate max-w-[250px] mx-auto">
                                            {selectedFileName}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {type === "testimonial" ? "PNG, JPG, MP4 up to 50MB" : "PNG, JPG up to 50MB"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="mr-4 px-6 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 bg-brand-gold text-white rounded-md font-bold text-sm uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                                {loading ? "Updating..." : "Update Testimonial"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
