"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Testimonial {
    id: string;
    name: string;
    designation: string;
    quote: string;
    imageUrl: string;
    type?: string;
}

import { getTestimonials } from "@/actions/getTestimonials";

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const data = await getTestimonials();
                setTestimonials(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, []);

    const writtenTestimonials = testimonials.filter(t => (t.type || 'testimonial') === 'testimonial');
    const socialProofs = testimonials.filter(t => t.type === 'social_proof');

    return (
        <>
            {/* Hero Section */}
            <section className="pt-24 pb-12 px-6 md:px-12 bg-brand-cream/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-[#d4af37] mb-6">
                        In Their Own Words...
                    </h1>
                    <p className="text-gray-600 font-bold text-lg">
                        Hear from our cherished community. Your stories make us who we are.
                    </p>
                </div>
            </section>

            {/* Written Testimonials Section */}
            <section className="py-16 px-6 bg-[#f5f0eb]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
                            <p className="text-gray-500 font-serif">Loading Testimonials...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load testimonials. Please try again later.
                        </div>
                    ) : writtenTestimonials.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No testimonials available at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {writtenTestimonials.map((testi) => {
                                const isVideo = testi.imageUrl?.match(/\.(mp4|webm|mov)$/i);
                                return (
                                <div key={testi.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                                    <div className={`${isVideo ? "" : ((testi.quote || testi.name) ? "h-64" : "h-[400px]")} overflow-hidden relative bg-black flex items-center justify-center`}>
                                        {isVideo ? (
                                            <video
                                                src={testi.imageUrl}
                                                className="w-full h-auto max-h-[700px] object-cover"
                                                controls
                                            />
                                        ) : (
                                            <Image
                                                src={testi.imageUrl}
                                                alt={testi.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    {(testi.quote || testi.name) && (
                                        <div className="p-8">
                                            {testi.quote && <div className="text-[#d4af37] text-4xl font-serif mb-4">“</div>}
                                            {testi.quote && (
                                                <p className="text-gray-600 italic mb-6 leading-relaxed">
                                                    {testi.quote}
                                                </p>
                                            )}
                                            {testi.name && (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                        {testi.name}
                                                    </h4>
                                                    <span className="text-xs text-gray-500">
                                                        {testi.designation}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Social Proofs Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-serif text-center mb-12 text-[#5d4a36]">
                        Social Media Proofs
                    </h2>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500 font-serif">Loading...</div>
                    ) : socialProofs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No social media proofs available at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {socialProofs.map(proof => (
                                <div
                                    key={proof.id}
                                    className="group relative aspect-[9/16] overflow-hidden rounded-xl shadow-lg bg-black"
                                    style={{
                                        background: "linear-gradient(135deg, #b8860b, #d4af37, #f3e5ab, #d4af37, #b8860b)",
                                    }}
                                >
                                    {proof.imageUrl?.match(/\.(mp4|webm|mov)$/i) ? (
                                        <video
                                            src={proof.imageUrl}
                                            className="w-full h-full object-contain"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <Image
                                            src={proof.imageUrl}
                                            alt={proof.name || "Customer Social Proof"}
                                            fill
                                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Feedback Form Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-serif mb-8 text-[#5d4a36]">
                        We Value Your Feedback
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Help us improve your experience with Label Reeha.
                    </p>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#d4af37] focus:outline-none transition-colors"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#d4af37] focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <textarea
                            placeholder="Your Message"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#d4af37] focus:outline-none transition-colors"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-[#1a1a1a] text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-[#d4af37] transition-colors"
                        >
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}
