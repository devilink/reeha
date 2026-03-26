"use server";

// In-memory cache for countries (refreshed every 24h on server)
let cachedCountries: { id: number; name: string; code: string }[] | null = null;
let countriesCacheTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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

export async function getShiprocketCountries(): Promise<{ id: number; name: string; code: string }[]> {
    // Return cached countries if still valid
    if (cachedCountries && (Date.now() - countriesCacheTime) < CACHE_DURATION) {
        return cachedCountries;
    }

    try {
        const token = await getShiprocketToken();
        if (!token) {
            console.error("Failed to get Shiprocket token for countries list");
            return getFallbackCountries();
        }

        const res = await fetch("https://apiv2.shiprocket.in/v1/external/countries", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        // The API returns { data: [ { id, name, code }, ... ] }
        if (data && Array.isArray(data.data) && data.data.length > 0) {
            cachedCountries = data.data.map((c: any) => ({
                id: c.id,
                name: c.name,
                code: c.code
            }));
            countriesCacheTime = Date.now();
            return cachedCountries!;
        }

        console.error("Unexpected Shiprocket countries response:", data);
        return getFallbackCountries();
    } catch (e) {
        console.error("Error fetching Shiprocket countries", e);
        return getFallbackCountries();
    }
}

function getFallbackCountries() {
    return [
        { id: 101, name: "India", code: "IN" },
        { id: 231, name: "United States", code: "US" },
        { id: 230, name: "United Kingdom", code: "GB" },
        { id: 38, name: "Canada", code: "CA" },
        { id: 13, name: "Australia", code: "AU" },
        { id: 229, name: "United Arab Emirates", code: "AE" },
        { id: 196, name: "Singapore", code: "SG" },
        { id: 79, name: "Germany", code: "DE" },
        { id: 74, name: "France", code: "FR" },
        { id: 105, name: "Italy", code: "IT" },
        { id: 154, name: "Netherlands", code: "NL" },
        { id: 191, name: "Saudi Arabia", code: "SA" },
        { id: 178, name: "Qatar", code: "QA" },
        { id: 165, name: "Oman", code: "OM" },
        { id: 114, name: "Kuwait", code: "KW" },
        { id: 131, name: "Malaysia", code: "MY" },
        { id: 157, name: "New Zealand", code: "NZ" },
        { id: 97, name: "Hong Kong", code: "HK" },
        { id: 108, name: "Japan", code: "JP" },
        { id: 211, name: "Switzerland", code: "CH" },
        { id: 162, name: "Norway", code: "NO" },
        { id: 210, name: "Sweden", code: "SE" },
        { id: 58, name: "Denmark", code: "DK" },
        { id: 104, name: "Ireland", code: "IE" }
    ];
}

function calculateInternationalShipping(country: string) {
    const c = (country || "").toLowerCase();

    // Zone 1: USA & Canada
    if (c.includes("united states") || c.includes("usa") || c === "us" || c.includes("canada") || c === "ca") {
        return { success: true, rate: 3200, courierName: "Standard International", estimatedDelivery: "8-12 Days" };
    }
    // Zone 2: UK & Western Europe
    if (c.includes("united kingdom") || c.includes("uk") || c === "gb" || c.includes("germany") || c === "de" || c.includes("france") || c === "fr" || c.includes("italy") || c === "it" || c.includes("spain") || c === "es" || c.includes("netherlands") || c === "nl") {
        return { success: true, rate: 2900, courierName: "Standard International", estimatedDelivery: "7-10 Days" };
    }
    // Zone 3: Middle East
    if (c.includes("uae") || c.includes("united arab emirates") || c === "ae" || c.includes("dubai") || c.includes("abu dhabi") || c.includes("saudi arabia") || c === "sa" || c.includes("qatar") || c === "qa" || c.includes("kuwait") || c === "kw" || c.includes("oman") || c === "om") {
        return { success: true, rate: 2200, courierName: "Express International", estimatedDelivery: "5-8 Days" };
    }
    // Zone 4: Australia & New Zealand
    if (c.includes("australia") || c === "au" || c.includes("new zealand") || c === "nz") {
        return { success: true, rate: 3500, courierName: "Standard International", estimatedDelivery: "10-15 Days" };
    }
    // Zone 5: Southeast Asia
    if (c.includes("singapore") || c === "sg" || c.includes("malaysia") || c === "my" || c.includes("thailand") || c === "th" || c.includes("hong kong") || c === "hk") {
        return { success: true, rate: 2000, courierName: "Standard International", estimatedDelivery: "5-8 Days" };
    }
    
    // Zone 6: Rest of the World
    return { success: true, rate: 5000, courierName: "Premium International", estimatedDelivery: "15-20 Days" };
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
        const isInternational = deliveryCountryCode !== "IN";
        const isIndiaLocal = !isInternational && deliveryPincode && deliveryPincode.length === 6;

        if (isInternational) {
            return calculateInternationalShipping(deliveryCountryName || deliveryCountryCode || "");
        }

        const token = await getShiprocketToken();
        if (!token) {
            if (isIndiaLocal) {
                return { success: true, rate: 200, courierName: "Standard Shipping", estimatedDelivery: "5-7 Business Days" };
            }
            return { success: false, error: "Authentication failed" };
        }

        const pickupPincode = process.env.NEXT_PUBLIC_STORE_PINCODE || "781001";

        // Dimensions for serviceability check
        const length = 10;
        const breadth = 10;
        const height = 10;

        // Domestic Serviceability
        if (!deliveryPincode || deliveryPincode.length !== 6) {
                return { success: false, error: "Please enter a valid 6-digit pincode" };
            }

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
                    rate: Math.ceil(cheapest.rate), 
                    courierName: cheapest.courier_name,
                    estimatedDelivery: cheapest.etd
                };
            }

            return { 
                success: true, 
                rate: 200, 
                courierName: "Standard Shipping", 
                estimatedDelivery: "5-7 Business Days",
                details: data 
            };

    } catch (e) {
        console.error("Error fetching shipping rates", e);
        const isInternational = deliveryCountryCode !== "IN";
        const isIndiaLocal = !isInternational && deliveryPincode && deliveryPincode.length === 6;
        if (isIndiaLocal) {
            return {
                success: true,
                rate: 200,
                courierName: "Standard Shipping",
                estimatedDelivery: "5-7 Business Days"
            };
        }
        return { success: false, error: "Failed to calculate shipping. Please try again." };
    }
}
