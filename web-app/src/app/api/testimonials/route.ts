import { NextResponse } from "next/server";
import { getTestimonials } from "@/actions/getTestimonials";

export async function GET() {
    try {
        const testimonials = await getTestimonials();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials in API route:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}
