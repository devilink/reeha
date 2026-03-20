"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function BuyNowButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();

    const handleBuyNow = () => {
        addToCart(product);
        router.push("/cart");
    };

    if (!isLoaded) {
        return (
            <button disabled className="flex items-center justify-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm shadow-xl bg-gray-300 text-white w-full sm:w-auto">
                <Zap size={20} /> Buy Now
            </button>
        );
    }

    if (!isSignedIn) {
        return (
            <SignInButton mode="modal">
                <button
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm transition-all duration-300 shadow-xl bg-brand-dark text-white hover:bg-black hover:-translate-y-1 w-full sm:w-auto"
                >
                    <Zap size={20} /> Buy Now
                </button>
            </SignInButton>
        );
    }

    return (
        <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full uppercase tracking-widest font-bold text-sm transition-all duration-300 shadow-xl bg-brand-dark text-white hover:bg-black hover:-translate-y-1 w-full sm:w-auto"
        >
            <Zap size={20} /> Buy Now
        </button>
    );
}
