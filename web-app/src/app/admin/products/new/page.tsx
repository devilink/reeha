"use client";

import { useState } from "react";
import { getPresignedUrl } from "@/actions/upload-actions";
import { createProduct } from "@/actions/product-actions";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function NewProductPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return alert("Please select an image");

        setUploading(true);
        const formData = new FormData(e.currentTarget);

        try {
            // 1. Get Presigned URL
            const { signedUrl, fileName } = await getPresignedUrl(file.type);

            // 2. Upload to S3
            await fetch(signedUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            // 3. Create Product in DB
            formData.set("imageUrl", fileName);
            await createProduct(formData);

        } catch (err) {
            console.error(err);
            alert("Failed to create product");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-2xl w-full p-8 rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-serif text-brand-dark mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-contain" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500">JPG, PNG (MAX. 5MB)</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input name="name" type="text" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-gold outline-none" placeholder="e.g. Gold Necklace" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input name="price" type="number" required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-gold outline-none" placeholder="e.g. 1500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={4} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Product details..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL (Optional)</label>
                            <input name="instaUrl" type="url" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-gold outline-none" placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL (Optional)</label>
                            <input name="fbUrl" type="url" className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-gold outline-none" placeholder="https://facebook.com/..." />
                        </div>
                    </div>

                    <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-dark text-white font-bold rounded-md hover:bg-brand-gold transition-colors flex justify-center items-center gap-2">
                        {uploading ? <><Loader2 className="animate-spin" /> Creating...</> : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
