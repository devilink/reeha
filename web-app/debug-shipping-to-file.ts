import fs from 'fs';

async function testShipping() {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;
    const pickupPincode = process.env.NEXT_PUBLIC_STORE_PINCODE || "781001";
    const deliveryPincode = "400001"; // Mumbai

    const results: any[] = [];

    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const authData: any = await authRes.json();
    const token = authData.token;

    if (!token) {
        fs.writeFileSync('debug_results.json', JSON.stringify({ error: "Auth failed", details: authData }));
        return;
    }

    const weights = [0.1, 0.2, 0.5, 0.8, 1.0];
    
    for (const weight of weights) {
        const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=0&length=10&breadth=10&height=10`;
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data: any = await res.json();
        results.push({
            weight,
            status: data.status,
            couriers: data.data?.available_courier_companies?.length || 0,
            message: data.message,
            cheapest: data.data?.available_courier_companies?.[0]?.rate
        });
    }

    fs.writeFileSync('debug_results.json', JSON.stringify(results, null, 2));
}

testShipping();
