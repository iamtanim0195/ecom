import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/authGuard";
import Order from "@/models/Order";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req) {
    try {
        const user = await requireAuth();
        await connectDB();

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json(
                { message: "orderId required" },
                { status: 400 }
            );
        }

        const order = await Order.findOne({
            _id: orderId,
            userId: user.id,
        });

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        if (order.payment?.status === "PAID") {
            return NextResponse.json(
                { message: "Order already paid" },
                { status: 409 }
            );
        }

        const paymentProvider = getPaymentProvider();

        const payment = await paymentProvider.createPayment({
            orderId: order._id.toString(),
            amount: order.subtotal,
            currency: order.currency,
            email: user.email,
        });

        order.payment = {
            provider: payment.provider,
            sessionId: payment.sessionId,
            status: "PENDING",
        };

        await order.save();

        return NextResponse.json(
            {
                checkoutUrl: payment.checkoutUrl,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PAYMENT CREATE ERROR:", err);
        return NextResponse.json(
            { message: "Payment init failed" },
            { status: 500 }
        );
    }
}
