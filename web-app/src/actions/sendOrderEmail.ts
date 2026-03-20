"use server";

import nodemailer from "nodemailer";

interface OrderEmailParams {
    paymentId: string;
    items: {
        name: string;
        price: number;
        quantity: number;
    }[];
    total: number;
    customerEmail?: string;
    customerName?: string;
}

export async function sendOrderEmail(orderDetails: OrderEmailParams) {
    try {
        const { EMAIL_USER, EMAIL_PASS } = process.env;

        if (!EMAIL_USER || !EMAIL_PASS) {
            console.error("Missing email credentials in environment variables.");
            return { success: false, error: "Email configuration error." };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const itemsHtml = orderDetails.items
            .map(
                (item) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
            </tr>
        `
            )
            .join("");

        const mailOptions = {
            from: `"Label Reeha Orders" <${EMAIL_USER}>`,
            to: "princedass000555@gmail.com", // Admin email
            subject: `New Order Received! Payment ID: ${orderDetails.paymentId}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d4af37;">New Order Notification</h2>
                    <p>A new order has been successfully placed.</p>
                    
                    <div style="background-color: #f9f7f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1a1a1a;">Order Details</h3>
                        <p><strong>Payment ID:</strong> ${orderDetails.paymentId}</p>
                        ${orderDetails.customerName ? `<p><strong>Customer Name:</strong> ${orderDetails.customerName}</p>` : ""}
                        ${orderDetails.customerEmail ? `<p><strong>Customer Email:</strong> ${orderDetails.customerEmail}</p>` : ""}
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #1a1a1a; color: white;">
                                <th style="padding: 10px; text-align: left;">Item</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37;">₹${orderDetails.total}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <p style="font-size: 12px; color: #888; text-align: center;">This is an automated message from your Label Reeha store.</p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Order success email sent:", result.messageId);
        
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Error sending order email:", error);
        return { success: false, error: "Failed to send email." };
    }
}
