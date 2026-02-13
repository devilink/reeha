import Image from "next/image";

export default function TestimonialsPage() {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                            <div className="h-64 overflow-hidden relative">
                                <Image
                                    src="/Assets/testi1.jpeg"
                                    alt="Ananya S."
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-8">
                                <div className="text-[#d4af37] text-4xl font-serif mb-4">“</div>
                                <p className="text-gray-600 italic mb-6 leading-relaxed">
                                    Purely handcrafted and extremely lightweight, the unique design
                                    ensures an all day comfort. The set arrives in a signature Label
                                    Reeha jewellery box, accompanied by a handwritten note and a
                                    little information about the artist’s inspiration.
                                </p>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                        Dr Ankumoni Saikia
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        Principal- Dhubri Medical College
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                            <div className="h-64 overflow-hidden relative">
                                <Image
                                    src="/Assets/testi2.jpeg"
                                    alt="Priya M."
                                    fill
                                    className="object-cover object-[20%_20%] transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-8">
                                <div className="text-[#d4af37] text-4xl font-serif mb-4">“</div>
                                <p className="text-gray-600 italic mb-6 leading-relaxed">
                                    I absolutely love this jewellery! It’s durable, bold and
                                    surprisingly affordable for the quality you get. I’ve worn it
                                    multiple times and it still looks as good as new. What I really
                                    appreciate is how versatile it is – it pairs perfectly with both
                                    western outfits and traditional Indian attire, making it a great
                                    choice for everyday wear as well as special occasions. Thanks
                                    Bini!
                                </p>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                        Jafrina Yesmin
                                    </h4>
                                    <span className="text-xs text-gray-500">UK</span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                            <div className="h-64 overflow-hidden relative">
                                <Image
                                    src="/Assets/testi3.jpeg"
                                    alt="Sneha R."
                                    fill
                                    className="object-cover object-[20%_20%] transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-8">
                                <div className="text-[#d4af37] text-4xl font-serif mb-4">“</div>
                                <p className="text-gray-600 italic mb-6 leading-relaxed">
                                    I had the pleasure of wearing stunning earrings and necklaces
                                    crafted from the stencils of paat, muga and eri silks, a
                                    cherished Assamese textile tradition from Label Reeha , during a
                                    recent event of mine. The pieces beautifully blend the intricate
                                    weaves of Assamese handloom with elegant jewelry design,
                                    offering a unique fusion of cultural heritage and modern
                                    sophistication perfect for both everyday wear and special
                                    occasions.
                                </p>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                        Seema Sharma -Partner
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        Versatilis Legal LLP, Delhi
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proofs Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-serif text-center mb-12 text-[#5d4a36]">
                        Social Media Proofs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            className="group relative aspect-[9/16] overflow-hidden rounded-xl shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(135deg, #b8860b, #d4af37, #f3e5ab, #d4af37, #b8860b)",
                            }}
                        >
                            <Image
                                src="/Assets/proof1.jpeg"
                                alt="Customer Social Proof 1"
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div
                            className="group relative aspect-[9/16] overflow-hidden rounded-xl shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(135deg, #b8860b, #d4af37, #f3e5ab, #d4af37, #b8860b)",
                            }}
                        >
                            <Image
                                src="/Assets/proof2.jpeg"
                                alt="Customer Social Proof 2"
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div
                            className="group relative aspect-[9/16] overflow-hidden rounded-xl shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(135deg, #b8860b, #d4af37, #f3e5ab, #d4af37, #b8860b)",
                            }}
                        >
                            <Image
                                src="/Assets/proof3.jpeg"
                                alt="Customer Social Proof 3"
                                fill
                                className="object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
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
