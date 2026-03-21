// No dependencies needed with --env-file

async function testShipping() {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;
    const pickupPincode = process.env.NEXT_PUBLIC_STORE_PINCODE || "781001";
    const deliveryPincode = "400001"; // Mumbai

    console.log("Authenticating...");
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const authData: any = await authRes.json();
    const token = authData.token;

    if (!token) {
        console.error("Auth failed");
        return;
    }

    const weights = [0.1, 0.2, 0.5, 1.0];
    
    for (const weight of weights) {
        console.log(`\n--- Testing weight: ${weight} kg ---`);
        const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=0&length=10&breadth=10&height=10`;
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data: any = await res.json();
        if (data.status === 200 && data.data && data.data.available_courier_companies && data.data.available_courier_companies.length > 0) {
            console.log(`[RESULT] Success! Courier: ${data.data.available_courier_companies[0].courier_name}, Rate: ${data.data.available_courier_companies[0].rate}`);
        } else {
            console.log(`[RESULT] Failed: ${data.message || "No serviceability for this location"}`);
            if (data.errors) console.log("Errors:", JSON.stringify(data.errors));
        }
    }
}

testShipping();
