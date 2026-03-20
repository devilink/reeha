"use client";

import { motion, Variants } from "framer-motion";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const revealVariant: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const staggerItem: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1 } }
};

export default function ContactPage() {
    return (
        <>
            <section className="pt-24 pb-12 px-6 md:px-12 bg-[#f5f0eb]">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="max-w-7xl mx-auto text-center"
                >
                    <motion.h1 variants={staggerItem} className="font-syne text-6xl md:text-8xl font-extrabold leading-none text-[#1a1a1a]">
                        GET IN <span className="text-[#d4af37]">TOUCH</span>
                    </motion.h1>
                    <motion.p variants={staggerItem} className="mt-4 text-xl md:text-2xl font-serif italic text-gray-600 max-w-3xl mx-auto">
                        For bespoke inquiries, press, or general questions, we are here to assist.
                    </motion.p>
                </motion.div>
            </section>

            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="lg:col-span-1"
                    >
                        <motion.h2 variants={staggerItem} className="font-syne text-3xl font-bold mb-8 mt-12 text-[#1a1a1a]">
                            Direct Inquiry
                        </motion.h2>

                        <div className="space-y-4">
                            <motion.a
                                variants={staggerItem}
                                href="https://wa.me/919773577782?text=Hello%20Label%20Reeha,%20I'm%20interested%20in%20your%20jewelry."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover-trigger flex items-center justify-center px-5 py-4 rounded-md text-white bg-[#25d366] hover:opacity-90 transition-all hover:-translate-y-1 shadow-md uppercase tracking-wider text-sm font-bold gap-3"
                            >
                                <MessageCircle size={20} /> WhatsApp DM
                            </motion.a>
                            <motion.a
                                variants={staggerItem}
                                href="https://www.facebook.com/label.reeha"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover-trigger flex items-center justify-center px-5 py-4 rounded-md text-white bg-[#1877f2] hover:opacity-90 transition-all hover:-translate-y-1 shadow-md uppercase tracking-wider text-sm font-bold gap-3"
                            >
                                <Facebook size={20} /> Facebook DM
                            </motion.a>
                            <motion.a
                                variants={staggerItem}
                                href="https://www.instagram.com/label.reeha"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover-trigger flex items-center justify-center px-5 py-4 rounded-md text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-all hover:-translate-y-1 shadow-md uppercase tracking-wider text-sm font-bold gap-3"
                            >
                                <Instagram size={20} /> Instagram DM
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className="lg:col-span-2"
                    >
                        <h2 className="font-syne text-3xl font-bold mb-8 text-[#1a1a1a]">
                            Send Us a Message
                        </h2>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="hover-trigger w-full border border-gray-300 px-4 py-3 bg-white text-[#1a1a1a] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition-colors rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="hover-trigger w-full border border-gray-300 px-4 py-3 bg-white text-[#1a1a1a] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition-colors rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className="hover-trigger w-full border border-gray-300 px-4 py-3 bg-white text-[#1a1a1a] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition-colors rounded"
                                >
                                    <option>General Inquiry</option>
                                    <option>Bespoke Commission</option>
                                    <option>Product In stock Check</option>
                                    <option>Press/Collaboration</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="hover-trigger w-full border border-gray-300 px-4 py-3 bg-white text-[#1a1a1a] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition-colors rounded"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="hover-trigger bg-[#1a1a1a] text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-[#d4af37] hover:text-[#1a1a1a] transition-all duration-300 font-bold"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
