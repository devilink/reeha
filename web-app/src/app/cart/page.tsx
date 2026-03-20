"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Script from "next/script";
import { useState, useEffect, useCallback } from "react";
import { estimateShippingCost } from "@/actions/shiprocket";
import { sendOrderEmail } from "@/actions/sendOrderEmail";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia", 
    "United Arab Emirates", "Singapore", "Germany", "France", "Italy", 
    "Netherlands", "Saudi Arabia", "Qatar", "Oman", "Kuwait", 
    "Malaysia", "New Zealand", "Hong Kong", "Japan", "Switzerland",
    "Norway", "Sweden", "Denmark", "Ireland"
].sort();

const countryMapping: Record<string, string> = {
    "India": "IN", "United States": "US", "United Kingdom": "GB", "Canada": "CA", 
    "Australia": "AU", "United Arab Emirates": "AE", "Singapore": "SG", 
    "Germany": "DE", "France": "FR", "Italy": "IT", "Netherlands": "NL", 
    "Saudi Arabia": "SA", "Qatar": "QA", "Oman": "OM", "Kuwait": "KW", 
    "Malaysia": "MY", "New Zealand": "NZ", "Hong Kong": "HK", "Japan": "JP",
    "Switzerland": "CH", "Norway": "NO", "Sweden": "SE", "Denmark": "DK", "Ireland": "IE"
};

export default function CartPage() {
    const { cart, removeFromCart, clearCart, cartCount } = useCart();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });
    const [shippingCost, setShippingCost] = useState(0);
    const [isEstimating, setIsEstimating] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const isIndia = customerInfo.country === "India";

    const calculateShipping = useCallback(async (info: { pincode: string; country: string }) => {
        const hasPincode = info.pincode.length > 0;
        const isIndiaLocal = info.country === "India";
        const isPincodeValid = isIndiaLocal ? info.pincode.length === 6 : hasPincode;

        if (isPincodeValid) {
            setIsEstimating(true);
            setShippingError(null);
            const countryCode = countryMapping[info.country] || "IN";
            
            // Real weight calculation: 0.2kg per item, minimum 1.0kg
            // (Increased to 1.0kg to ensure better courier serviceability)
            const totalWeight = Math.max(1.0, cartCount * 0.2);

            const res = await estimateShippingCost({ 
                deliveryPincode: info.pincode, 
                weight: totalWeight,
                deliveryCountryCode: countryCode,
                deliveryCountryName: info.country
            });

            if (res.success && res.rate) {
                setShippingCost(res.rate);
            } else {
                console.error("Shipping calculation failed:", res.error);
                setShippingCost(0);
                setShippingError(res.error || "No serviceability for this location");
            }
            setIsEstimating(false);
        } else {
            setShippingCost(0);
            setShippingError(null);
        }
    }, [cartCount]);

    // Load from localStorage on mount ONLY
    useEffect(() => {
        const savedInfo = localStorage.getItem("reeha_customer_info");
        if (savedInfo) {
            try {
                const parsed = JSON.parse(savedInfo);
                setCustomerInfo(parsed);
                // Trigger an initial calculation if we have enough info
                if (parsed.pincode) {
                    calculateShipping(parsed);
                }
            } catch (e) {
                console.error("Failed to parse saved customer info", e);
            }
        }
    }, []);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderTotal = total + (shippingCost || 0);

    const handleSaveAddress = () => {
        setIsSaving(true);
        localStorage.setItem("reeha_customer_info", JSON.stringify(customerInfo));
        calculateShipping(customerInfo);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleCheckout = async () => {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            alert("Razorpay Key ID not configured!");
            return;
        }

        const isValidZip = isIndia ? customerInfo.pincode.length === 6 : customerInfo.pincode.length > 0;

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.state || !isValidZip) {
            alert(isIndia ? "Please fill in all shipping details with a valid 6-digit Pincode before proceeding." : "Please fill in all shipping details with a valid Zip/Postal Code before proceeding.");
            return;
        }

        try {
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: orderTotal }),
            });
            const data = await res.json();

            if (!res.ok || !data.order) {
                alert("Failed to initiate payment. " + (data.error || ""));
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Label Reeha",
                description: "Purchase from Label Reeha",
                image: "/Assets/logo.jpeg",
                order_id: data.order.id,
                handler: async function (response: any) {
                    alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                    
                    const orderDetails = {
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        items: cart.map(item => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        })),
                        total: orderTotal,
                        customerName: customerInfo.name,
                        customerEmail: customerInfo.email,
                        address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}, ${customerInfo.country}`,
                        phone: customerInfo.phone
                    };

                    try {
                        await sendOrderEmail(orderDetails);
                    } catch (e) {
                        console.error("Failed to send order email:", e);
                    }

                    clearCart();
                },
                prefill: {
                    name: customerInfo.name,
                    email: customerInfo.email,
                    contact: customerInfo.phone,
                },
                theme: {
                    color: "#d4af37",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", (response: any) => {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error("Error launching razorpay checkout", error);
            alert("Error launching payment gateway.");
        }
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
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <h1 className="text-4xl font-serif text-brand-dark mb-12 text-center md:text-left">Your Shopping Bag</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-grow space-y-8">
                    <div className="space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8">
                                <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
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

                    <div className="bg-[#f9f7f2] p-8 rounded-lg shadow-sm border border-brand-gold/20 mt-12">
                        <h2 className="font-serif text-2xl text-brand-dark mb-6">Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="Full Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="Email Address" type="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="Phone Number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                            
                            <div className="md:col-span-2">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Country</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:border-brand-gold appearance-none cursor-pointer"
                                    value={customerInfo.country}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value, pincode: "" })}
                                >
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold md:col-span-2" placeholder="Full Street Address" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="City" value={customerInfo.city} onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} />
                            <input className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" placeholder="State/Province" value={customerInfo.state} onChange={e => setCustomerInfo({...customerInfo, state: e.target.value})} />
                            
                            <input 
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder={isIndia ? "Pincode (6 digits)" : "Zip / Postal Code"} 
                                value={customerInfo.pincode} 
                                onChange={e => {
                                    if (isIndia) {
                                        setCustomerInfo({...customerInfo, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)});
                                    } else {
                                        setCustomerInfo({...customerInfo, pincode: e.target.value});
                                    }
                                }} 
                                maxLength={isIndia ? 6 : 20} 
                            />
                            
                            <div className="md:col-span-2 pt-4">
                                <button
                                    onClick={handleSaveAddress}
                                    className="w-full md:w-auto px-10 py-3 bg-brand-gold text-white uppercase tracking-widest font-bold text-xs rounded-md shadow hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? "Address Saved ✓" : "Save Shipping Address"}
                                </button>
                                <p className="text-[10px] text-gray-400 mt-2 italic">*Saving your address will calculate the correct shipping rates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[400px] flex-shrink-0">
                    <div className="bg-[#f9f7f2] p-8 rounded-lg shadow-sm border border-brand-gold/20">
                        <h2 className="font-serif text-xl border-b border-gray-200 pb-4 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Shipping</span>
                                {isEstimating ? (
                                    <span className="text-gray-400 text-sm animate-pulse">Calculating...</span>
                                ) : shippingError ? (
                                    <span className="text-red-400 text-xs text-right max-w-[150px]">{shippingError}</span>
                                ) : shippingCost > 0 ? (
                                    <span className="font-medium text-brand-dark">₹{shippingCost}</span>
                                ) : (
                                    <span className="font-medium text-gray-500 italic text-sm">{isIndia ? "Enter valid pincode" : "Enter zip/postal code"}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{orderTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isEstimating || total === 0}
                            className="w-full py-4 bg-brand-dark text-white uppercase tracking-widest font-bold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEstimating ? "Calculating..." : "Proceed to Checkout"}
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
