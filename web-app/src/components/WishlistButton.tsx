"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
    product: Product;
    className?: string; // Allow custom styling positioning
    iconSize?: number;
}

export default function WishlistButton({ product, className = "", iconSize = 20 }: WishlistButtonProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isSaved = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent triggering parent Link clicks
        if (isSaved) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`transition-all duration-300 hover:scale-110 ${className} ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart size={iconSize} fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
        </button>
    );
}
