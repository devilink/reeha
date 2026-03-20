"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Globe, Eye, Gem } from "lucide-react";

const revealVariant: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } }
};

export default function AboutPage() {
  return (
    <>
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:order-2"
          >
            <motion.span variants={staggerItem} className="font-sans text-sm uppercase tracking-widest text-[#1a1a1a]/50 block mb-3">
              About The Brand
            </motion.span>
            <motion.h2 variants={staggerItem} className="font-syne text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-[#d4af37]">The Soul Of Label Reeha</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-lg text-gray-600 leading-relaxed mb-6">
              At Label Reeha, every piece of jewellery is more than an accessory: it’s a <strong>handcrafted
              story</strong>. Each design is meticulously created using traditional Assamese textiles. Assam’s
              rich heritage in weaving, especially Assam Silk and the renowned Assam Muga, is celebrated worldwide
              for its beauty, vibrancy, and intricate motifs.
            </motion.p>
            <motion.p variants={staggerItem} className="text-lg text-gray-600 leading-relaxed mb-8">
              Inspired by this cultural richness, we envisioned jewellery that blends these exquisite textiles
              with timeless, hand-crafted artistry. The result is a collection where age-old techniques meet
              contemporary, bohemian charm. From bold, ethnic statement pieces to delicate jewellery for everyday
              wear, every creation embodies craftsmanship, culture, and individuality.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ filter: "grayscale(100%)", scale: 0.9, opacity: 0 }}
            whileInView={{ filter: "grayscale(0%)", scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:order-1 aspect-[4/5] shadow-2xl relative"
          >
            <Image 
              src="/Assets/homeie.jpeg" 
              alt="Traditional Assamese textiles and jewelry details"
              fill
              className="object-cover object-[50%_15%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-[#1a1a1a] text-[#f5f0eb] px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={revealVariant} 
            className="text-center mb-16"
          >
            <span className="font-sans text-sm uppercase tracking-widest text-[#d4af37] block mb-3">
              The Founder's Story
            </span>
            <h2 className="font-syne text-5xl md:text-7xl font-bold">A Mother's Legacy</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={revealVariant} 
              className="border-l border-[#d4af37] pl-6"
            >
              <p className="font-serif text-xl italic leading-relaxed text-gray-400 mb-6">
                "She was born, and so was the brand. I’ve always believed that some things choose you before you
                choose them. For me, that was my daughter, Reeha. And soon after, it was this brand."
              </p>

              <div className="mt-8 relative h-64 w-full group">
                <Image 
                  src="/Assets/reeha.jpeg" 
                  alt="Detail of Assamese jewellery"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={staggerContainer} 
              className="text-gray-400 leading-relaxed"
            >
              <div className="mb-6">
                <motion.p variants={staggerItem} className="text-[#d4af37] text-lg font-bold mb-2">Defining "Reeha"</motion.p>
                <motion.p variants={staggerItem} className="text-gray-400 text-sm leading-relaxed">
                  In Assamese tradition, a Reeha is a sacred cloth. It’s part of what a mother gifts her
                  daughter : a symbol of love, blessings, and everything you want to wrap around someone you
                  cherish. When I became a mother, that word took on a whole new meaning for me.
                </motion.p>
              </div>
              <motion.p variants={staggerItem} className="mb-4 text-sm">
                I wanted to hold on to that emotion. To the rituals. To where I come from. That’s how Label
                Reeha was born … as a way to bring a piece of Assam into the lives of women everywhere.
              </motion.p>
              <motion.p variants={staggerItem} className="mb-4 text-sm">
                Each piece we make is inspired by our roots, made slowly and lovingly by hand, and tells a story
                that’s bigger than trends. This isn’t just jewellery. It's a memory. It’s meaning.
              </motion.p>
              <motion.p variants={staggerItem} className="mb-6 text-sm">
                It’s a thread that ties the past to the present and maybe even to the future.
              </motion.p>
              <motion.p variants={staggerItem} className="mb-6 text-[#d4af37] text-sm">
                From my heart to yours, Welcome to Label Reeha!
              </motion.p>
              <motion.div variants={staggerItem} className="text-[#d4af37] font-syne text-xl">
                — Binita Baruah
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-[#f9f7f2]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={revealVariant} 
            className="text-center mb-16"
          >
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#1a1a1a]/50 mb-4 block">
              Purpose & Promise
            </span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold">Our Philosophy</h2>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={staggerItem} className="p-8 bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <Globe className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="font-syne text-2xl mb-3 text-[#1a1a1a]">Our Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To bring Assam, my homeland to a global audience. We stand for emotional connection, cultural
                pride, and true artisanal value, offering pieces that make every woman feel beautifully seen,
                resisting the sterile perfection of fast fashion.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="p-8 bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <Eye className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="font-syne text-2xl mb-3 text-[#1a1a1a]">Our Vision</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To share the spirit of Assam with the world “One handcrafted piece at a time”. We envision a
                world where jewellery is storytelling in wearable form, and every woman feels celebrated in what
                she chooses to wear.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="p-8 bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <Gem className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="font-syne text-2xl mb-3 text-[#1a1a1a]">Authentic Craft</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our designs intertwine hand-woven textiles, folklore, and artisanal skill to create wearable
                stories. Each piece connects you to your roots through slow, authentic fashion : truly “Assam in
                Every Thread.”
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={revealVariant} 
            className="text-center mt-12"
          >
            <Link href="/shop" className="inline-block mt-4 border border-[#1a1a1a] px-8 py-3 uppercase tracking-widest text-sm bg-[#1a1a1a] text-white hover:bg-[#d4af37] hover:border-[#d4af37] transition-all duration-300 hover-trigger">
              Explore The Collection
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
