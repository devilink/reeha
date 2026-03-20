import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: amount * 100, // Amount is in currency subunits (paise)
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) {
            throw new Error("Razorpay failed to create an order.");
        }

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error("Payment creation failed: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
