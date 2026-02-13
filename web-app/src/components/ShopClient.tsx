"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Product } from "@/types";
import CompactAddToCartButton from "./CompactAddToCartButton";
import WishlistButton from "./WishlistButton";

interface ShopClientProps {
    initialProducts: Product[];
}

const ITEMS_PER_PAGE = 12;
const COMMON_WHATSAPP_NUMBER = "919773577782";

export default function ShopClient({ initialProducts }: ShopClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialProducts, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const displayedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const getWhatsappLink = (productName: string) => {
        return `https://wa.me/${COMMON_WHATSAPP_NUMBER}?text=I'm interested in ${encodeURIComponent(productName)}`;
    };


    return (
        <>
            <div className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
                <h1 className="font-cinzel text-center text-4xl md:text-7xl font-extrabold mb-4 bg-gradient-to-br from-[#b8860b] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
                    THE CURATED VOLUME
                </h1>
                <p className="text-center text-lg text-gray-500 max-w-4xl mx-auto mb-12 font-bold tracking-wide">
                    Each design is crafted using various traditional Assamese textiles like Assam Silk, Eri, iconic Muga and
                    many others such as the Gamocha where age-old
                    techniques meet a contemporary, bohemian spirit appealing across ages and styles.
                </p>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-300 pb-6">
                    <div className="w-full md:w-1/3 relative">
                        <input
                            type="text"
                            placeholder="Search product name..."
                            className="w-full bg-white border border-gray-300 px-5 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            {/* Image Container */}
                            <Link
                                href={`/product/${product.id}`}
                                className="relative aspect-[3/4] mb-4 cursor-pointer overflow-hidden bg-gray-50 border border-gray-100 block"
                            >
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-contain transition-transform duration-1000 group-hover:scale-110 p-2"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                                {/* Logo Overlay */}
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full border border-white/50 z-10 overflow-hidden bg-white/20 backdrop-blur-sm">
                                    <Image src="/Assets/logo.jpeg" alt="Logo" width={32} height={32} className="object-cover" />
                                </div>

                                {/* Wishlist Overlay */}
                                <div className="absolute top-2 left-2 z-20">
                                    <WishlistButton product={product} className="bg-white/80 p-2 rounded-full shadow-sm hover:bg-white" />
                                </div>
                            </Link>

                            <div className="">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-serif text-xl mb-1 hover:text-brand-gold transition-colors">{product.name}</h3>
                                </Link>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-brand-dark font-medium">₹ {product.price}</p>
                                    <CompactAddToCartButton product={product} />
                                </div>

                                {/* Status (Placeholder logic as status isn't in DB yet, but design requires it) */}
                                <div className="mb-2 h-4"></div>

                                <div className="flex justify-between items-center mt-2">
                                    <a
                                        href={getWhatsappLink(product.name)}
                                        target="_blank"
                                        className="text-xs text-gray-500 uppercase tracking-widest font-bold hover:text-brand-gold transition-colors flex items-center gap-1"
                                    >
                                        Inquire now <i className="fas fa-arrow-right text-xs"></i>
                                    </a>
                                    <div className="flex space-x-3 text-[#d4af37]">
                                        {product.instaUrl && (
                                            <a href={product.instaUrl} target="_blank" className="hover:scale-110 transition-transform text-[#E1306C]">
                                                <i className="fab fa-instagram text-2xl"></i>
                                            </a>
                                        )}
                                        {product.fbUrl && (
                                            <a href={product.fbUrl} target="_blank" className="hover:scale-110 transition-transform text-[#1877F2]">
                                                <i className="fab fa-facebook text-2xl"></i>
                                            </a>
                                        )}
                                        <a href={getWhatsappLink(product.name)} target="_blank" className="hover:scale-110 transition-transform text-[#25D366]">
                                            <i className="fab fa-whatsapp text-2xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* No Results */}
                {displayedProducts.length === 0 && (
                    <div className="text-center py-24">
                        <h3 className="font-serif text-3xl text-gray-400">No items found matching your search.</h3>
                        <p className="text-gray-500 mt-2">Try clearing the search.</p>
                    </div>
                )}


                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${currentPage === page
                                    ? 'bg-brand-gold text-white border-brand-gold'
                                    : 'hover:bg-brand-gold hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </>
    );
}
