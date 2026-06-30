import { getProductById } from "@/actions/getProductById";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthLayout from "../../(auth)/layout";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return notFound();
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-brand-gold mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                {/* Image Section */}
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-auto object-cover"
                        />
                    ) : (
                        <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4">{product.name}</h1>
                    {product.status && product.status !== 'Available' && (
                        <p className={`text-sm font-bold uppercase tracking-wide mb-2 ${product.status === 'Unavailable' ? 'text-red-500' : 'text-[#d4af37]'}`}>
                            {product.status}
                        </p>
                    )}
                    <p className="text-2xl font-bold text-brand-gold mb-8">₹{product.price}</p>

                    <div className="prose prose-stone mb-10 text-gray-600 leading-relaxed">
                        <p>{product.description || "No description available for this handcrafted beauty."}</p>
                        {/* Fallback description if empty */}
                        <p className="mt-4 italic text-sm text-gray-400">
                            * Each piece is handcrafted, slight variations may occur.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <AddToCartButton product={product} />
                        <BuyNowButton product={product} />
                    </div>

                    {/* Additional Details */}
                    <div className="mt-12 border-t pt-8 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Material</span>
                            <span className="font-medium text-brand-dark">Authentic Assamese Textile / Beads</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-medium text-brand-dark">3-5 Business Days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
