import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/payments/stripe.webhook";

export async function POST(req) {
    try {
        const provider = process.env.PAYMENT_PROVIDER;

        if (provider === "stripe") {
            await handleStripeWebhook(req);
            return NextResponse.json({ received: true });
        }

        return NextResponse.json(
            { message: "Unsupported provider" },
            { status: 400 }
        );
    } catch (err) {
        console.error("WEBHOOK ERROR:", err.message);
        return NextResponse.json(
            { message: "Webhook error" },
            { status: 400 }
        );
    }
}
