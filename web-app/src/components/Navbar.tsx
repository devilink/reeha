"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram, Facebook, MessageCircle } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoaded, isSignedIn } = useUser();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur shadow-sm px-6 py-4 flex justify-between items-center">
            {/* --- Logo --- */}
            <div className="flex items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-[65px] h-[65px] flex items-center justify-center rounded-full p-[2px] bg-gradient-to-br from-[#b8860b] via-[#d4af37] to-[#b8860b] shadow-md group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full relative rounded-full overflow-hidden bg-white">
                            <Image
                                src="/Assets/logo.jpeg"
                                alt="Label Reeha"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <span className="font-cinzel text-xl md:text-2xl font-semibold bg-gradient-to-br from-[#b8860b] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent uppercase tracking-wider hidden sm:block">
                        Label Reeha
                    </span>
                </Link>
            </div>

            {/* --- Desktop Nav --- */}
            <nav className="hidden md:flex items-center gap-8">
                <ul className="flex gap-8 list-none">
                    {["Home", "About", "Shop", "Testimonials", "Contact"].map((item) => (
                        <li key={item}>
                            <Link
                                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className="text-[#5d4a36] font-medium uppercase text-sm tracking-widest hover:text-[#af9b89] transition-colors"
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* --- User & Cart --- */}
                <div className="flex items-center gap-6 border-l border-gray-200 pl-6">
                    <Link href="/wishlist" className="text-[#5d4a36] hover:text-[#E1306C] transition-colors relative">
                        <span className="sr-only">Wishlist</span>
                        <i className="far fa-heart text-lg"></i>
                    </Link>
                    <Link href="/cart" className="text-[#5d4a36] hover:text-[#d4af37] transition-colors relative">
                        <span className="sr-only">Cart</span>
                        <i className="fas fa-shopping-bag text-lg"></i>
                    </Link>
                    {isLoaded ? (
                        isSignedIn ? (
                            <UserButton />
                        ) : (
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-[#5d4a36] uppercase tracking-wider hover:text-[#d4af37]">
                                    Login
                                </button>
                            </SignInButton>
                        )
                    ) : null}
                </div>
            </nav>

            {/* --- Mobile Menu Button --- */}
            <button
                className="md:hidden text-[#5d4a36] z-50 relative"
                onClick={toggleMenu}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* --- Mobile Menu Overlay --- */}
            <div
                className={`fixed inset-0 bg-[#f9f7f2] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <ul className="flex flex-col items-center gap-6 text-xl">
                    {["Home", "About", "Shop", "Testimonials", "Contact"].map((item) => (
                        <li key={item}>
                            <Link
                                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className="text-[#5d4a36] font-medium uppercase tracking-widest"
                                onClick={toggleMenu}
                            >
                                {item}
                            </Link>
                        </li>
                    ))}
                    {/* Added Cart for Mobile */}
                    <li>
                        <Link href="/cart" onClick={toggleMenu} className="text-[#5d4a36] font-medium uppercase tracking-widest">
                            Cart
                        </Link>
                    </li>
                </ul>

                <div className="flex gap-6 mt-4">
                    <a href="https://www.instagram.com/label.reeha/" target="_blank" className="text-[#5d4a36] hover:text-[#d4af37]"><Instagram /></a>
                    <a href="https://www.facebook.com/label.reeha" target="_blank" className="text-[#5d4a36] hover:text-[#d4af37]"><Facebook /></a>
                    <a href="https://wa.me/919773577782" target="_blank" className="text-[#5d4a36] hover:text-[#d4af37]"><MessageCircle /></a>
                </div>
                {/* Mobile Auth */}
                <div className="mt-4">
                    {isLoaded ? (
                        isSignedIn ? (
                            <div className="scale-125"><UserButton /></div>
                        ) : (
                            <SignInButton mode="modal">
                                <button className="px-8 py-3 bg-[#d4af37] text-white rounded-full uppercase tracking-widest text-sm font-bold shadow-lg">
                                    Login / Sign Up
                                </button>
                            </SignInButton>
                        )
                    ) : null}
                </div>
            </div>
        </header>
    );
}
