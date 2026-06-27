import { getTestimonials } from "@/actions/getTestimonials";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminTestimonialsClient from "@/components/admin/AdminTestimonialsClient";

export default async function AdminTestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif text-brand-dark">Testimonial Management</h1>
                    <Link href="/admin/testimonials/new" className="px-6 py-2 bg-brand-gold text-white rounded-md font-bold text-sm uppercase hover:bg-black transition-colors">
                        + Add New Testimonial
                    </Link>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                    <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-brand-dark transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Dashboard
                    </Link>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <Link href="/admin/products" className="inline-flex items-center text-brand-gold hover:text-brand-dark font-medium transition-colors">
                        Manage Products →
                    </Link>
                </div>

                <AdminTestimonialsClient initialTestimonials={testimonials} />
            </div>
        </div>
    );
}
