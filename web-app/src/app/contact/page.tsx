import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <section className="pt-24 pb-12 px-6 md:px-12 bg-brand-cream">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-serif text-6xl md:text-8xl font-extrabold leading-none text-brand-dark">
                        GET IN <span className="text-brand-gold">TOUCH</span>
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl font-serif italic text-gray-600 max-w-3xl mx-auto">
                        For bespoke inquiries, press, or general questions, we are here to
                        assist.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-1">
                        <h2 className="font-serif text-3xl font-bold mb-8 mt-12 text-brand-dark">
                            Direct Inquiry
                        </h2>

                        <div className="space-y-4">
                            <a
                                href="https://wa.me/919773577782?text=Hello%20Label%20Reeha,%20I'm%20interested%20in%20your%20jewelry."
                                target="_blank"
                                className="flex items-center justify-center px-5 py-3 rounded-md text-white bg-[#25d366] hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md uppercase tracking-wider text-sm font-bold gap-2"
                            >
                                <MessageCircle size={20} /> WhatsApp DM
                            </a>
                            <a
                                href="https://www.facebook.com/label.reeha"
                                target="_blank"
                                className="flex items-center justify-center px-5 py-3 rounded-md text-white bg-[#1877f2] hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md uppercase tracking-wider text-sm font-bold gap-2"
                            >
                                <Facebook size={20} /> Facebook DM
                            </a>
                            <a
                                href="https://www.instagram.com/label.reeha"
                                target="_blank"
                                className="flex items-center justify-center px-5 py-3 rounded-md text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md uppercase tracking-wider text-sm font-bold gap-2"
                            >
                                <Instagram size={20} /> Instagram DM
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="font-serif text-3xl font-bold mb-8 text-brand-dark">
                            Send Us a Message
                        </h2>
                        <form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full border border-gray-300 px-4 py-3 bg-white text-brand-dark focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-colors rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full border border-gray-300 px-4 py-3 bg-white text-brand-dark focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-colors rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className="w-full border border-gray-300 px-4 py-3 bg-white text-brand-dark focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-colors rounded"
                                >
                                    <option>General Inquiry</option>
                                    <option>Bespoke Commission</option>
                                    <option>Product In stock Check</option>
                                    <option>Press/Collaboration</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full border border-gray-300 px-4 py-3 bg-white text-brand-dark focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-colors rounded"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-brand-dark text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark transition-colors font-bold"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
