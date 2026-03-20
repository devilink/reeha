"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function CompactBuyNowButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add to cart and immediately redirect to checkout
        addToCart(product);
        router.push("/cart");
    };

    if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;

    if (!isSignedIn) {
        return (
            <SignInButton mode="modal">
                <button
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 ml-2 rounded-full bg-brand-gold text-white hover:bg-[#b8860b] transition-colors shadow-sm"
                    title="Login to Buy Now"
                >
                    <Zap size={18} />
                </button>
            </SignInButton>
        );
    }

    return (
        <button
            onClick={handleBuyNow}
            className="p-2 ml-2 rounded-full transition-all duration-300 shadow-sm border bg-brand-gold text-white border-brand-gold hover:bg-[#b8860b]"
            title="Buy Now"
        >
            <Zap size={18} />
        </button>
    );
}
