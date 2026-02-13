"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";

// A smaller version of the main button, suitable for cards
export default function CompactAddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const { isSignedIn, isLoaded } = useUser();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;

    if (!isSignedIn) {
        return (
            <SignInButton mode="modal">
                <button
                    onClick={(e) => e.stopPropagation()} // Prevent link navigation
                    className="p-2 rounded-full bg-white border border-gray-200 text-brand-gold hover:bg-brand-gold hover:text-white transition-colors shadow-sm"
                    title="Login to Add to Cart"
                >
                    <ShoppingBag size={18} />
                </button>
            </SignInButton>
        );
    }

    return (
        <button
            onClick={handleAdd}
            disabled={added}
            className={`p-2 rounded-full transition-all duration-300 shadow-sm border ${added
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-brand-gold border-gray-200 hover:bg-brand-gold hover:text-white"
                }`}
            title="Add to Cart"
        >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
        </button>
    );
}
