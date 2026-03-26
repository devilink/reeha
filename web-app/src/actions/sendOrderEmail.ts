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
    address?: string;
    phone?: string;
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
            to: EMAIL_USER, // Admin email
            subject: `New Order Received! Payment ID: ${orderDetails.paymentId}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d4af37;">New Order Notification</h2>
                    <p>A new order has been successfully placed via Razorpay.</p>
                    <p><strong>Payment ID:</strong> ${orderDetails.paymentId}</p>
                    
                    <div style="background-color: #f9f7f2; padding: 20px; border-radius: 8px; border: 1px solid #d4af37; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 5px;">Customer & Shipping Details</h3>
                        <p><strong>Name:</strong> ${orderDetails.customerName || 'N/A'}</p>
                        <p><strong>Email:</strong> ${orderDetails.customerEmail || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${orderDetails.phone || 'N/A'}</p>
                        <div style="margin-top: 15px; padding: 10px; background: white; border-left: 4px solid #d4af37;">
                            <strong>Shipping Address:</strong><br/>
                            ${orderDetails.address ? orderDetails.address.split(',').join(',<br/>') : 'N/A'}
                        </div>
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
