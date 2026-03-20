"use server";

export async function getShiprocketToken() {
    try {
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            console.error("Missing Shiprocket credentials");
            return null;
        }

        const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.token) {
            return data.token;
        }
        
        console.error("Shiprocket Auth Failed:", data);
        return null;
    } catch (e) {
        console.error("Error getting shiprocket token", e);
        return null;
    }
}

export async function estimateShippingCost({ 
    deliveryPincode, 
    weight = 1.0, 
    deliveryCountryCode = "IN",
    deliveryCountryName = "India"
}: { 
    deliveryPincode: string; 
    weight?: number;
    deliveryCountryCode?: string;
    deliveryCountryName?: string;
}) {
    try {
        const token = await getShiprocketToken();
        if (!token) return { success: false, error: "Authentication failed" };

        const pickupPincode = process.env.NEXT_PUBLIC_STORE_PINCODE || "781001";
        const isInternational = deliveryCountryCode !== "IN" && deliveryCountryCode !== "India";

        // Dimensions are often required for serviceability
        const length = 10;
        const breadth = 10;
        const height = 10;

        if (isInternational) {
            // Using delivery_country (name) as it is often more reliable for international serviceability
            const url = `https://apiv2.shiprocket.in/v1/external/international/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_country=${encodeURIComponent(deliveryCountryName)}&weight=${weight}&cod=0&length=${length}&width=${breadth}&height=${height}`;
            console.log("Fetching International Shipping Rate:", url);
            
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("Shiprocket International Response:", JSON.stringify(data));

            if (data.status === 200 && data.data && data.data.available_courier_companies && data.data.available_courier_companies.length > 0) {
                const couriers = data.data.available_courier_companies;
                const cheapest = couriers.reduce((prev: any, curr: any) => {
                    return (parseFloat(prev.rate) < parseFloat(curr.rate)) ? prev : curr;
                });
                
                return { 
                    success: true, 
                    rate: Math.ceil(parseFloat(cheapest.rate)), 
                    courierName: cheapest.courier_name,
                    estimatedDelivery: cheapest.etd
                };
            }

            return { success: false, error: data.message || "No international serviceability for this destination", details: data };
        } else {
            // Domestic Serviceability
            const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=0&length=${length}&breadth=${breadth}&height=${height}`;
            console.log("Fetching Domestic Shipping Rate:", url);

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("Shiprocket Domestic Response:", JSON.stringify(data));

            if ((data.status === 200 || data.status_code === 200) && data.data && data.data.available_courier_companies && data.data.available_courier_companies.length > 0) {
                const couriers = data.data.available_courier_companies;
                const cheapest = couriers.reduce((prev: any, curr: any) => {
                    return (prev.rate < curr.rate) ? prev : curr;
                });
                
                return { 
                    success: true, 
                    rate: cheapest.rate, 
                    courierName: cheapest.courier_name,
                    estimatedDelivery: cheapest.etd
                };
            }

            return { success: false, error: data.message || "No serviceability for this pincode", details: data };
        }

    } catch (e) {
        console.error("Error fetching shipping rates", e);
        return { success: false, error: "Failed to calculate shipping" };
    }
}
