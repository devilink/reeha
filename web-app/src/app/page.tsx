import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";
import { Truck, PencilRuler, Gem } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      {/* --- Collection Grid 1 --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-syne">Assam, Woven Within...</h2>
          <p className="text-gray-500 tracking-wide max-w-md mx-auto">"One handcrafted piece at a time"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll1.jpeg" alt="Collection 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Handwoven textile of Assam, handcrafted jewellery with colorful beads</h3>
            </div>
          </div>

          {/* Item 2 */}
          <div className="group cursor-pointer md:mt-12">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll2.jpg" alt="Collection 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">A statement piece with artisan woven textile of Assam</h3>
            </div>
          </div>

          {/* Item 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll3.png" alt="Collection 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">A beautiful set by artisan crafted textile from Assam</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- Collection Grid 2 --- */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Item 4 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll6.jpeg" alt="Collection 4" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Featuring Ghicha textile, woven in Assam set against a traditional mask from Majuli.</h3>
            </div>
          </div>

          {/* Item 5 */}
          <div className="group cursor-pointer md:mt-12">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll5.jpeg" alt="Collection 5" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">A statement piece handcrafted in Toss Muga textile of Assam with golden and red beads.</h3>
            </div>
          </div>

          {/* Item 6 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-gray-200 mb-4 overflow-hidden rounded-lg">
              <Image src="/Assets/coll4.png" alt="Collection 6" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">A set in folk embroidered, reflecting the rich cultural heritage and craftsmanship of Assam.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- Founder Section --- */}
      <section className="py-32 px-6 bg-brand-dark text-brand-cream relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center md:w-1/2 order-2 md:order-1">
              <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed mb-8 opacity-80 text-brand-gold">
                "Label Reeha is a manifestation of a lifelong dream."
                <p className="font-sans text-base mt-4 text-brand-cream not-italic">
                  My journey in jewellery began as a profession and grew into a passion for craftmanship and from there Label Reeha was born. <br />
                  Two things remained unwavering throughout this journey: designs inspired by the heritage of Assam and the Northeast,
                  their textiles, motifs, and stories and a name deeply connected to Assam's cultural essence.
                </p>
              </blockquote>
              <cite className="font-sans not-italic uppercase tracking-widest text-sm text-brand-gold block mt-6">
                — Binita Baruah, Founder/Designer
              </cite>
              <div className="mt-8">
                <Link href="/about" className="inline-block border border-white/20 rounded-full px-8 py-3 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all">
                  Read More
                </Link>
              </div>
            </div>

            <div className="md:w-1/3 order-1 md:order-2">
              <div className="relative w-full aspect-[3/4] md:w-[350px] border-4 border-brand-gold shadow-2xl bg-brand-dark">
                <Image src="/Assets/founder.jpeg" alt="Founder" fill className="object-cover object-top p-2" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] border border-brand-gold/30 rounded-full pointer-events-none" />
      </section>

      {/* --- Service & Care --- */}
      <section className="py-24 px-6 bg-[#f9f7f2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">

            {/* Delivery */}
            <div className="px-4 py-8 md:py-0">
              <div className="text-brand-gold mb-6 flex justify-center"><Truck size={40} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl mb-4 text-[#5d4a36]">Delivery</h3>
              <div className="text-gray-600 space-y-2 text-sm leading-relaxed">
                <p><strong>All over India:</strong><br />3-5 business days - INR 80<br /><span className="text-[#d4af37] text-xs font-semibold">(Free Shipping above Rs 1500)</span></p>
                <p><strong>Next Day Delivery:</strong> INR 120</p>
                <p className="pt-2"><strong>Worldwide Delivery</strong></p>
                <p className="pt-2"><strong>Return:</strong><br />Within 7 working days<br /><span className="italic text-xs">(Unboxing video mandatory)</span></p>
              </div>
            </div>

            {/* Customization */}
            <div className="px-4 py-8 md:py-0">
              <div className="text-brand-gold mb-6 flex justify-center"><PencilRuler size={40} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl mb-4 text-[#5d4a36]">Customization</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                We create jewellery your way: choose the design, color, and fabric to make it uniquely yours.
              </p>
            </div>

            {/* Care Tip */}
            <div className="px-4 py-8 md:py-0">
              <div className="text-brand-gold mb-6 flex justify-center"><Gem size={40} strokeWidth={1.5} /></div>
              <h3 className="font-serif text-2xl mb-4 text-[#5d4a36]">Care Tip</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-3 list-disc list-inside">
                <li>Avoid washing with water.</li>
                <li>For a sparkling effect, gently wipe the gold and silver colored charms with cotton dipped in vinegar.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
