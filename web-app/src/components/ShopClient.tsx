"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Product } from "@/types";
import CompactAddToCartButton from "./CompactAddToCartButton";
import CompactBuyNowButton from "./CompactBuyNowButton";
import WishlistButton from "./WishlistButton";

interface ShopClientProps {
    initialProducts: Product[];
}

const ITEMS_PER_PAGE = 8;
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
        <section className="pt-24 pb-12 px-6 md:px-12 bg-[#f9f7f2] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-serif text-6xl md:text-8xl font-extrabold text-center mb-4 text-[#d4af37]">
                    THE CURATED VOLUME
                </h1>
                <p className="text-center text-lg text-gray-500 max-w-4xl mx-auto mb-12 font-bold">
                    Each design is crafted using various traditional Assamese textiles like Assam Silk, Eri, iconic Muga and
                    many others such as the Gamocha where age-old
                    techniques meet a contemporary, bohemian spirit appealing across ages and styles.
                </p>

                {/* Search Bar & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-300 pb-6">
                    <div className="w-full md:w-1/3 relative text-[#1a1a1a]">
                        <input
                            type="text"
                            placeholder="Search product name or material..."
                            className="w-full bg-white border border-gray-300 px-5 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    {/* Add Category Tabs here if needed later (like in Shop.html) */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-2/3"></div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedProducts.map((product, index) => (
                        <div key={product.id} className="group relative">
                            {/* Image Container with Reveal Effect from Shop.html */}
                            <Link href={`/product/${product.id}`} className="block relative overflow-hidden mb-4 bg-gray-100 product-image-trigger">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        loading={index < 4 ? "eager" : "lazy"}
                                        className="w-full h-auto object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full aspect-[4/5] flex items-center justify-center text-gray-300">No Image</div>
                                )}
                                
                                {/* Overlay Interactions */}
                                <div className="absolute top-2 left-2 z-20">
                                    <WishlistButton product={product} className="bg-white/80 p-2 text-[#1a1a1a] rounded-full shadow-sm hover:bg-white" />
                                </div>
                            </Link>

                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-serif text-xl mb-1 text-[#1a1a1a] hover:text-[#d4af37] transition-colors">{product.name}</h3>
                            </Link>
                            
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-[#1a1a1a] font-medium">₹ {product.price}</p>
                                <div className="flex items-center">
                                    <CompactAddToCartButton product={product} />
                                    <CompactBuyNowButton product={product} />
                                </div>
                            </div>

                            {/* Status logic mimicking Shop.html markup */}
                            <div className="mb-3 h-4">
                                {/* If product status was available:
                                <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">Available</p>
                                */}
                            </div>

                            <div className="flex justify-between items-center text-[#1a1a1a]">
                                <a
                                    href={getWhatsappLink(product.name)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-gray-500 uppercase tracking-widest font-bold hover:text-[#d4af37] transition-colors flex items-center"
                                >
                                    Inquire now <i className="fas fa-arrow-right ml-2 text-xs"></i>
                                </a>
                                <div className="flex space-x-3 items-center">
                                    {product.instaUrl && (
                                        <a href={product.instaUrl} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform hover-trigger text-[#E1306C]" title="Instagram">
                                            <Instagram size={24} />
                                        </a>
                                    )}
                                    {product.fbUrl && (
                                        <a href={product.fbUrl} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform hover-trigger text-[#1877F2]" title="Facebook">
                                            <Facebook size={24} />
                                        </a>
                                    )}
                                    <a href={getWhatsappLink(product.name)} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform hover-trigger text-[#25D366]" title="WhatsApp">
                                        <MessageCircle size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results container from Shop.html */}
                {displayedProducts.length === 0 && (
                    <div className="text-center py-24">
                        <h3 className="font-serif text-3xl text-gray-400">No items found matching your filter/search.</h3>
                        <p className="text-gray-500 mt-2">Try clearing the search or choosing another category.</p>
                    </div>
                )}

                {/* Pagination Controls formatted like Shop.html */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                                    currentPage === page
                                        ? 'bg-[#d4af37] text-white border-[#d4af37]'
                                        : 'hover:bg-[#d4af37] hover:text-white text-[#1a1a1a]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
