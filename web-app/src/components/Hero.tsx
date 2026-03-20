"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    "/Assets/hero1.png",
    "/Assets/hero2.png",
    "/Assets/hero.png",
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="h-[calc(100vh-80px)] mt-[80px] flex justify-center pb-[30px] overflow-hidden">
            <div className="w-[96%] h-full relative rounded-[30px] overflow-hidden shadow-2xl">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slides[currentSlide]}
                            alt={`Hero Image ${currentSlide + 1}`}
                            fill
                            priority
                            sizes="(max-width: 768px) 300vw, 100vw"
                            className="object-cover object-[85%_center] md:object-[center_30%]"
                            quality={100}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Content */}
                <div className="absolute top-1/2 left-[20px] md:left-[10%] -translate-y-1/2 z-10 text-white w-[65%] md:w-auto md:max-w-[800px] pr-[10px] md:pr-0">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-4xl md:text-7xl font-extrabold font-serif mb-2 leading-tight bg-gradient-to-br from-[#b8860b] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent drop-shadow-md"
                    >
                        ASSAM IN<br />EVERY THREAD
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-sm md:text-lg font-medium leading-relaxed drop-shadow-md max-w-[600px]"
                    >
                        “Rooted in tradition. Worn with pride. Crafted by hand.”<br />
                        Label Reeha creates modern handcrafted jewellery that honors Assamese roots and textile.
                        More than an accessory, each piece is a story of heritage.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="mt-8"
                    >
                        <Link
                            href="/shop"
                            className="inline-block px-8 py-4 bg-white text-[#5d4a36] font-semibold uppercase tracking-[3px] rounded-full shadow-lg hover:bg-[#E8D8C0] hover:text-white hover:-translate-y-1 transition-all duration-300"
                        >
                            Explore & Shop
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
