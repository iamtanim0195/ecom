import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { sendOrderConfirmedEmail } from "@/lib/email/orderEmails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handleStripeWebhook(req) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Stripe signature verification failed");
        throw new Error("INVALID_SIGNATURE");
    }

    // ✅ Payment completed
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) return;

        await connectDB();

        // Update order
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status: "CONFIRMED",
                "payment.status": "PAID",
            },
            { new: true }
        );

        if (!order) return;

        // Fetch user email
        const user = await User.findById(order.userId);
        if (!user?.email) return;

        // 📧 Send confirmation email
        try {
            await sendOrderConfirmedEmail(order, user.email);
        } catch (emailErr) {
            console.error("❌ Failed to send order confirmation email", emailErr);
        }
    }
}
