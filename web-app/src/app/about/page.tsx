import Image from "next/image";
import Link from "next/link";
import { Globe, Eye, Gem } from "lucide-react";

export default function AboutPage() {
    return (
        <>
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="lg:order-2">
                        <span className="font-sans text-sm uppercase tracking-widest text-brand-dark/50 block mb-3">
                            About The Brand
                        </span>
                        <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-tight text-brand-dark">
                            <span className="text-brand-gold">The Soul Of Label Reeha</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            At Label Reeha, every piece of jewellery is more than an accessory:
                            it’s a <strong>handcrafted story</strong>. Each design is
                            meticulously created using traditional Assamese textiles. Assam’s
                            rich heritage in weaving, especially Assam Silk and the renowned
                            Assam Muga, is celebrated worldwide for its beauty, vibrancy, and
                            intricate motifs.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Inspired by this cultural richness, we envisioned jewellery that
                            blends these exquisite textiles with timeless, hand-crafted
                            artistry. The result is a collection where age-old techniques meet
                            contemporary, bohemian charm. From bold, ethnic statement pieces to
                            delicate jewellery for everyday wear, every creation embodies
                            craftsmanship, culture, and individuality.
                        </p>
                    </div>

                    <div className="lg:order-1 aspect-[4/5] shadow-2xl relative">
                        <Image
                            src="/Assets/homeie.jpeg"
                            alt="Traditional Assamese textiles and jewelry details"
                            fill
                            className="object-cover"
                            style={{ objectPosition: "50% 15%" }}
                        />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-brand-dark text-brand-cream px-6 md:px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="font-sans text-sm uppercase tracking-widest text-brand-gold block mb-3">
                            The Founder's Story
                        </span>
                        <h2 className="font-serif text-5xl md:text-7xl font-bold">
                            A Mother's Legacy
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="border-l border-brand-gold pl-6">
                            <p className="font-serif text-xl italic leading-relaxed text-gray-400 mb-6">
                                "She was born, and so was the brand. I’ve always believed that
                                some things choose you before you choose them. For me, that was my
                                daughter, Reeha. And soon after, it was this brand."
                            </p>

                            <div className="mt-8 relative h-64 w-full">
                                <Image
                                    src="/Assets/reeha.jpeg"
                                    alt="Detail of Assamese jewellery"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </div>

                        <div className="text-gray-400 leading-relaxed">
                            <div className="mb-6">
                                <p className="text-brand-gold text-lg font-bold mb-2">
                                    Defining "Reeha"
                                </p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    In Assamese tradition, a Reeha is a sacred cloth. It’s part of
                                    what a mother gifts her daughter : a symbol of love, blessings,
                                    and everything you want to wrap around someone you cherish. When
                                    I became a mother, that word took on a whole new meaning for me.
                                </p>
                            </div>
                            <p className="mb-4 text-sm">
                                I wanted to hold on to that emotion. To the rituals. To where I
                                come from. That’s how Label Reeha was born … as a way to bring a
                                piece of Assam into the lives of women everywhere.
                            </p>
                            <p className="mb-4 text-sm">
                                Each piece we make is inspired by our roots, made slowly and
                                lovingly by hand, and tells a story that’s bigger than trends.
                                This isn’t just jewellery. It's a memory. It’s meaning.
                            </p>
                            <p className="mb-6 text-sm">
                                It’s a thread that ties the past to the present and maybe even to
                                the future.
                            </p>
                            <p className="mb-6 text-brand-gold text-sm">
                                From my heart to yours, Welcome to Label Reeha!
                            </p>
                            <div className="text-brand-gold font-serif text-xl">
                                — Binita Baruah
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="font-sans text-xs uppercase tracking-[0.4em] text-brand-dark/50 mb-4 block">
                            Purpose & Promise
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark">
                            Our Philosophy
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <Globe className="w-10 h-10 text-brand-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-3 text-brand-dark">Our Mission</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                To bring Assam, my homeland to a global audience. We stand for
                                emotional connection, cultural pride, and true artisanal value,
                                offering pieces that make every woman feel beautifully seen,
                                resisting the sterile perfection of fast fashion.
                            </p>
                        </div>

                        <div className="p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <Eye className="w-10 h-10 text-brand-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-3 text-brand-dark">Our Vision</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                To share the spirit of Assam with the world “One handcrafted piece
                                at a time”. We envision a world where jewellery is storytelling in
                                wearable form, and every woman feels celebrated in what she
                                chooses to wear.
                            </p>
                        </div>

                        <div className="p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <Gem className="w-10 h-10 text-brand-gold mb-4" />
                            <h3 className="font-serif text-2xl mb-3 text-brand-dark">Authentic Craft</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Our designs intertwine hand-woven textiles, folklore, and
                                artisanal skill to create wearable stories. Each piece connects
                                you to your roots through slow, authentic fashion : truly “Assam
                                in Every Thread.”
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/shop"
                            className="inline-block mt-4 border border-brand-dark px-8 py-3 uppercase tracking-widest text-sm bg-brand-dark text-white hover:bg-brand-gold hover:border-brand-gold transition-colors"
                        >
                            Explore The Collection
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
