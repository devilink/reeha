"use client";

import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

    if (wishlistCount === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
                <h1 className="text-3xl font-serif text-brand-dark">Your Wishlist is Empty</h1>
                <p className="text-gray-500">Save your favorite handcrafted pieces here.</p>
                <Link href="/shop" className="px-8 py-3 bg-brand-gold text-white rounded-full uppercase tracking-widest font-bold shadow-lg hover:bg-[#b8860b] transition-all">
                    Browse Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <h1 className="text-4xl font-serif text-brand-dark mb-12 text-center md:text-left">Details from your Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">No Image</div>
                            )}
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-gray-400 hover:text-red-500 transition-colors z-10"
                                title="Remove"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <Link href={`/product/${product.id}`} className="block">
                                <h3 className="font-serif text-xl mb-2 text-brand-dark hover:text-brand-gold">{product.name}</h3>
                            </Link>
                            <p className="text-brand-gold font-bold text-lg mb-4">₹{product.price}</p>

                            <AddToCartButton product={product} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
