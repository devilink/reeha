import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen pt-16 pb-24 px-6 md:px-12 max-w-4xl mx-auto bg-brand-cream/10">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-gold transition-colors mb-8"
            >
                <ArrowLeft size={16} />
                Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4 text-center">Terms and Conditions</h1>
            <p className="text-gray-500 text-center mb-12 italic">Welcome to Label Reeha</p>

            <div className="prose prose-brand max-w-none text-gray-700 space-y-8">
                <section>
                    <p className="leading-relaxed">
                        These Terms and Conditions ("Terms") govern your use of our website <a href="https://www.labelreeha.com" className="text-brand-gold hover:underline">www.labelreeha.com</a> and our products and services. By accessing or purchasing from us, you agree to abide by these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Orders &amp; Acceptance</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Order Confirmation:</strong> As a registered user, you must log in to www.labelreeha.com using your registered email ID and a password of your choice. You are solely responsible for maintaining the confidentiality and security of your password. Any orders placed through your login credentials will be deemed to have been placed by you and will be processed accordingly.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Order processing, shipping &amp; Delivery</h2>
                    <ul className="list-disc pl-5 space-y-4">
                        <li><strong>Processing Time:</strong> Since our products are purely handcrafted, the standard orders are processed within 5-7 business days.</li>
                        
                        <li>
                            <strong>Shipping Timelines:</strong>
                            <ul className="list-disc pl-5 mt-2 text-gray-600">
                                <li>Standard Shipping (India): 5-7 business days</li>
                            </ul>
                        </li>

                        <li>
                            <strong>Shipping Charges:</strong>
                            <ul className="list-disc pl-5 mt-2 text-gray-600">
                                <li>Free shipping within India for orders above 3000 INR.</li>
                                <li>Shipping costs for international orders vary widely depending on the courier, destination, and package specifics.</li>
                            </ul>
                        </li>

                        <li><strong>Delays:</strong> We are not responsible for delays due to customs clearance, weather, or courier issues.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Replacement/Damaged products</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>All products undergo thorough quality checks prior to dispatch. However, any damage occurring during transit after shipment is beyond our control. If you receive a damaged product, we will arrange a replacement of the same or a similar item, subject to stock availability.</p>
                        
                        <p>For international orders, returns and refunds are not permitted unless the product is received in a defective or damaged condition. Refunds will be issued only in cases where the item was damaged at the time of delivery. We do not offer refunds for change of mind.</p>
                        
                        <p className="font-semibold text-brand-dark bg-yellow-50 p-4 border border-yellow-200 rounded-md">
                            Please note that an unboxing video is mandatory to process any such replacement request in both the cases.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Privacy policy &amp; Data Security</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Data Collection:</strong> We collect customer data (name, contact details, shipping address) to process orders and provide services.</li>
                        <li><strong>Third-Party Sharing:</strong> Data is not shared with third parties except for order fulfilment and marketing services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Copyright &amp; Intellectual Property</h2>
                    <p className="leading-relaxed">
                        All content (logos, designs, images, text) on <a href="https://www.labelreeha.com" className="text-brand-gold hover:underline">www.labelreeha.com</a> is owned by Label Reeha. This site is designed, updated and managed independently by <a href="https://www.labelreeha.com" className="text-brand-gold hover:underline">www.labelreeha.com</a>. Unauthorized reproduction, modification, or distribution is strictly prohibited. We reserve the right to take legal action for infringement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Limitation of Liability</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Label Reeha is not liable for indirect, incidental, or consequential damages from product use.</li>
                        <li>Product images may slightly differ due to lighting and screen resolution; such variations do not qualify for refunds.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Amendments to terms &amp; Conditions</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Label Reeha reserves the right to modify these Terms at any time.</li>
                        <li>All amendments will be applicable immediately after the updates are made on this site.</li>
                        <li>Customers will be notified of significant updates via email or website notices.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-brand-dark mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
                    <p className="leading-relaxed">
                        For any queries or legal concerns, contact:<br />
                        <strong>Email:</strong> <a href="mailto:labelreeha@gmail.com" className="text-brand-gold hover:underline">labelreeha@gmail.com</a>
                    </p>
                </section>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="font-serif text-xl text-brand-dark mb-2">Thank you for choosing Label Reeha!</p>
                </div>
            </div>
        </div>
    );
}
