import { getTestimonialById } from "@/actions/getTestimonialById";
import EditTestimonialForm from "./EditTestimonialForm";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const testimonial = await getTestimonialById(id);
        
        if (!testimonial) {
            return notFound();
        }

        return <EditTestimonialForm testimonial={testimonial} />;
    } catch (error) {
        return notFound();
    }
}
