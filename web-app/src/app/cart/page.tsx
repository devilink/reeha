"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CartPage() {
    const { cart, removeFromCart, clearCart, cartCount } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            alert("Razorpay Key ID not configured!");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: total * 100, // Amount in paise
            currency: "INR",
            name: "Label Reeha",
            description: "Purchase from Label Reeha",
            image: "/Assets/logo.jpeg",
            handler: function (response: any) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                clearCart();
                // Here you would typically verify the payment on the server
            },
            prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#d4af37",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    if (cartCount === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
                <h1 className="text-3xl font-serif text-brand-dark">Your Cart is Empty</h1>
                <p className="text-gray-500">Looks like you haven't added any treasures yet.</p>
                <Link href="/shop" className="px-8 py-3 bg-brand-gold text-white rounded-full uppercase tracking-widest font-bold shadow-lg hover:bg-[#b8860b] transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <h1 className="text-4xl font-serif text-brand-dark mb-12 text-center md:text-left">Your Shopping Bag</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-grow space-y-8">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8">
                            <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                )}
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-serif text-lg text-brand-dark mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="font-bold text-brand-gold">₹{item.price * item.quantity}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-[400px] flex-shrink-0">
                    <div className="bg-[#f9f7f2] p-8 rounded-lg shadow-sm border border-brand-gold/20">
                        <h2 className="font-serif text-xl border-b border-gray-200 pb-4 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-brand-dark text-white uppercase tracking-widest font-bold text-sm hover:bg-brand-gold transition-colors"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 text-xs text-center text-gray-400">
                            <p>Secured by Razorpay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
