import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Shiprocket sends a signature to verify the source, but for initial setup, we will log the body
        console.log("Shiprocket Webhook Received:", JSON.stringify(body, null, 2));

        // Common events:
        // SHIPMENT_TRACKING_STATUS: Update delivery details
        // ORDER_STATUS_UPDATE: Update order status

        const { current_status, shipment_id, order_id } = body;

        // Custom logic here: e.g., Update your database or send an email to the customer
        console.log(`Order ${order_id} (Shipment ${shipment_id}) status is now: ${current_status}`);

        // Return 200 to acknowledge receipt
        return NextResponse.json({ success: true, message: "Webhook processed" });

    } catch (error) {
        console.error("Error processing Shiprocket webhook:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// Optional: GET to verify the endpoint is reachable
export async function GET() {
    return NextResponse.json({ status: "Shiprocket Webhook Endpoint is Active" });
}
