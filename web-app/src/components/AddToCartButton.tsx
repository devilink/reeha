"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const { isSignedIn, isLoaded } = useUser();

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // If auth is loading, render a placeholder or nothing to avoid layout shift, 
    // currently rendering nothing or a disabled button is fine.
    if (!isLoaded) {
        return (
            <button disabled className="flex items-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm shadow-xl bg-gray-300 text-white">
                <ShoppingBag size={20} /> Add to Cart
            </button>
        );
    }

    if (!isSignedIn) {
        return (
            <SignInButton mode="modal">
                <button
                    className="flex items-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm transition-all duration-300 shadow-xl bg-brand-gold text-white hover:bg-[#b8860b] hover:-translate-y-1"
                >
                    <ShoppingBag size={20} /> Add to Cart
                </button>
            </SignInButton>
        );
    }

    return (
        <button
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm transition-all duration-300 shadow-xl ${added
                ? "bg-green-600 text-white"
                : "bg-brand-gold text-white hover:bg-[#b8860b] hover:-translate-y-1"
                }`}
        >
            {added ? (
                <>
                    <Check size={20} /> Added to Cart
                </>
            ) : (
                <>
                    <ShoppingBag size={20} /> Add to Cart
                </>
            )}
        </button>
    );
}
