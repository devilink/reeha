"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, MapPin, Truck, Plus, Minus } from "lucide-react";
import Script from "next/script";
import { useState, useEffect, useCallback, useRef } from "react";
import { estimateShippingCost, getShiprocketCountries } from "@/actions/shiprocket";
import { sendOrderEmail } from "@/actions/sendOrderEmail";
import dynamic from "next/dynamic";
import type { AddressResult } from "@/components/AddressAutocomplete";

const AddressAutocomplete = dynamic(
    () => import("@/components/AddressAutocomplete"),
    { ssr: false }
);

const AddressMap = dynamic(
    () => import("@/components/AddressMap"),
    { ssr: false, loading: () => <div className="w-full h-[300px] mb-6 bg-gray-100 animate-pulse rounded-md" /> }
);

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

interface CountryOption {
    id: number;
    name: string;
    code: string;
}

export default function CartPage() {
    const { cart, removeFromCart, clearCart, cartCount, addToCart, decreaseQuantity } = useCart();

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        countryCode: "IN",
    });
    const [shippingCost, setShippingCost] = useState(0);
    const [isEstimating, setIsEstimating] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);
    const [courierInfo, setCourierInfo] = useState<{ name: string; etd: string } | null>(null);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isIndia = customerInfo.countryCode === "IN";

    // Load countries from Shiprocket API on mount
    useEffect(() => {
        async function fetchCountries() {
            setLoadingCountries(true);
            try {
                const data = await getShiprocketCountries();
                // Sort alphabetically but keep India first
                const sorted = data.sort((a, b) => {
                    if (a.code === "IN") return -1;
                    if (b.code === "IN") return 1;
                    return a.name.localeCompare(b.name);
                });
                setCountries(sorted);
            } catch (e) {
                console.error("Failed to load countries", e);
            } finally {
                setLoadingCountries(false);
            }
        }
        fetchCountries();
    }, []);

    // Calculate shipping function
    const calculateShipping = useCallback(async (info: { pincode: string; country: string; countryCode: string }) => {
        const isIndiaLocal = info.countryCode === "IN";
        const isPincodeValid = isIndiaLocal ? info.pincode.length === 6 : info.pincode.trim().length > 0;

        if (!isPincodeValid) {
            setShippingCost(0);
            setShippingError(null);
            setCourierInfo(null);
            return;
        }

        setIsEstimating(true);
        setShippingError(null);
        setCourierInfo(null);
        
        // Real weight calculation: 0.2kg per item, minimum 0.5kg
        const totalWeight = Math.max(0.5, cartCount * 0.2);

        const res = await estimateShippingCost({ 
            deliveryPincode: info.pincode, 
            weight: totalWeight,
            deliveryCountryCode: info.countryCode,
            deliveryCountryName: info.country
        });

        if (res.success && res.rate) {
            setShippingCost(res.rate);
            setCourierInfo({ 
                name: res.courierName || "", 
                etd: res.estimatedDelivery || "" 
            });
        } else {
            setShippingCost(0);
            setShippingError(res.error || "Shipping not available for this location");
        }
        setIsEstimating(false);
    }, [cartCount]);

    // Load saved address from localStorage on mount
    useEffect(() => {
        const savedInfo = localStorage.getItem("reeha_customer_info");
        if (savedInfo) {
            try {
                const parsed = JSON.parse(savedInfo);
                // Ensure countryCode field exists for older saved data
                if (!parsed.countryCode) {
                    parsed.countryCode = parsed.country === "India" ? "IN" : "US";
                }
                setCustomerInfo(parsed);
                if (parsed.pincode) {
                    calculateShipping(parsed);
                }
            } catch (e) {
                console.error("Failed to parse saved customer info", e);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-save address to localStorage on change (debounced)
    useEffect(() => {
        if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
        autoSaveRef.current = setTimeout(() => {
            localStorage.setItem("reeha_customer_info", JSON.stringify(customerInfo));
        }, 300);
        return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
    }, [customerInfo]);

    // Auto-calculate shipping when pincode or country changes (debounced)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            calculateShipping(customerInfo);
        }, 600);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [customerInfo.pincode, customerInfo.country, customerInfo.countryCode]); // eslint-disable-line react-hooks/exhaustive-deps

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderTotal = total + (shippingCost || 0);

    const handleCountryChange = (countryName: string) => {
        const selected = countries.find(c => c.name === countryName);
        setCustomerInfo({ 
            ...customerInfo, 
            country: countryName, 
            countryCode: selected?.code || "IN",
            pincode: "" // Reset pincode when country changes
        });
        setShippingCost(0);
        setShippingError(null);
        setCourierInfo(null);
    };

    const handleAddressSelect = (result: AddressResult) => {
        // Match country from Geoapify to Shiprocket country list
        let matchedCountryName = result.country || customerInfo.country;
        let matchedCountryCode = result.countryCode || customerInfo.countryCode;
        
        if (result.countryCode && countries.length > 0) {
            const found = countries.find(
                c => c.code?.toUpperCase() === result.countryCode.toUpperCase()
            );
            if (found) {
                matchedCountryName = found.name;
                matchedCountryCode = found.code;
            }
        }

        setCustomerInfo({
            ...customerInfo,
            address: result.formatted || customerInfo.address,
            city: result.city || customerInfo.city,
            state: result.state || customerInfo.state,
            pincode: result.postcode || customerInfo.pincode,
            country: matchedCountryName,
            countryCode: matchedCountryCode,
        });
    };

    const isFormComplete = customerInfo.name && customerInfo.email && customerInfo.phone && 
        customerInfo.address && customerInfo.city && customerInfo.state && 
        (isIndia ? customerInfo.pincode.length === 6 : customerInfo.pincode.trim().length > 0);

    const canCheckout = isFormComplete && shippingCost > 0 && !isEstimating;

    const handleCheckout = async () => {
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            alert("Razorpay Key ID not configured!");
            return;
        }

        if (!canCheckout) {
            if (!isFormComplete) {
                alert(isIndia 
                    ? "Please fill in all shipping details with a valid 6-digit Pincode." 
                    : "Please fill in all shipping details with a valid Zip/Postal Code.");
            } else if (shippingCost === 0) {
                alert("Shipping charges could not be calculated. Please check your address and try again.");
            }
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <p className="text-gray-500">Looks like you haven&apos;t added any treasures yet.</p>
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
                                        <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                    )}
                                </div>

                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-serif text-lg text-brand-dark mb-1">{item.name}</h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button 
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-brand-dark hover:border-brand-dark transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => addToCart(item)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-brand-dark hover:border-brand-dark transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
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
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin size={22} className="text-brand-gold" />
                            <h2 className="font-serif text-2xl text-brand-dark">Shipping Details</h2>
                        </div>
                        
                        <AddressMap onAddressSelect={handleAddressSelect} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                id="shipping-name"
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder="Full Name" 
                                value={customerInfo.name} 
                                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} 
                            />
                            <input 
                                id="shipping-email"
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder="Email Address" 
                                type="email" 
                                value={customerInfo.email} 
                                onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} 
                            />
                            <input 
                                id="shipping-phone"
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder={isIndia ? "Phone Number (10 digits)" : "Phone Number"} 
                                value={customerInfo.phone} 
                                onChange={e => {
                                    if (isIndia) {
                                        setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10)});
                                    } else {
                                        setCustomerInfo({...customerInfo, phone: e.target.value});
                                    }
                                }} 
                            />
                            
                            <div>
                                <label htmlFor="shipping-country" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Country</label>
                                <select 
                                    id="shipping-country"
                                    className="w-full bg-white border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:border-brand-gold appearance-none cursor-pointer"
                                    value={customerInfo.country}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    disabled={loadingCountries}
                                >
                                    {loadingCountries ? (
                                        <option>Loading countries...</option>
                                    ) : (
                                        countries.map(country => (
                                            <option key={country.id} value={country.name}>{country.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <AddressAutocomplete
                                placeholder="Start typing your address..."
                                initialValue={customerInfo.address}
                                onAddressSelect={handleAddressSelect}
                            />
                            <input 
                                id="shipping-city"
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder="City" 
                                value={customerInfo.city} 
                                onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} 
                            />
                            <input 
                                id="shipping-state"
                                className="border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
                                placeholder="State / Province" 
                                value={customerInfo.state} 
                                onChange={e => setCustomerInfo({...customerInfo, state: e.target.value})} 
                            />
                            
                            <div className="md:col-span-2">
                                <input 
                                    id="shipping-pincode"
                                    className="w-full border border-gray-200 p-3 rounded-md bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold" 
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
                                <p className="text-[10px] text-gray-400 mt-1.5 italic flex items-center gap-1">
                                    <Truck size={12} />
                                    Shipping charges are calculated automatically based on your location.
                                </p>
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
                                    <span className="text-gray-400 text-sm flex items-center gap-1.5">
                                        <Loader2 size={14} className="animate-spin" />
                                        Calculating...
                                    </span>
                                ) : shippingError ? (
                                    <span className="text-red-400 text-xs text-right max-w-[180px]">{shippingError}</span>
                                ) : shippingCost > 0 ? (
                                    <span className="font-medium text-brand-dark">₹{shippingCost}</span>
                                ) : (
                                    <span className="font-medium text-gray-500 italic text-sm">
                                        {isIndia ? "Enter 6-digit pincode" : "Enter zip/postal code"}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{orderTotal}</span>
                            </div>
                        </div>

                        <button
                            id="checkout-button"
                            onClick={handleCheckout}
                            disabled={!canCheckout}
                            className="w-full py-4 bg-brand-dark text-white uppercase tracking-widest font-bold text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEstimating ? "Calculating Shipping..." : !isFormComplete ? "Complete Address to Checkout" : shippingCost === 0 ? "Enter Address for Shipping" : "Proceed to Checkout"}
                        </button>

                        {!canCheckout && isFormComplete && !isEstimating && shippingCost === 0 && !shippingError && (
                            <p className="text-xs text-center text-amber-600 mt-2">
                                Enter your {isIndia ? "pincode" : "zip/postal code"} to calculate shipping
                            </p>
                        )}

                        <div className="mt-4 text-xs text-center text-gray-400">
                            <p>Secured by Razorpay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
