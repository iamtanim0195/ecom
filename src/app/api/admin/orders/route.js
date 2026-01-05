import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/authGuard";
import { ROLES } from "@/lib/roles";
import Order from "@/models/Order";
import User from "@/models/User";
import {
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
} from "@/lib/email/orderEmails";

/**
 * GET — List all orders (Manager / Admin)
 */
export async function GET() {
    try {
        await requireAuth([ROLES.MANAGER, ROLES.ADMIN]);
        await connectDB();

        const orders = await Order.find()
            .populate("userId", "email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/**
 * PATCH — Update order status (Shipping flow)
 */
export async function PATCH(req) {
    try {
        const user = await requireAuth([ROLES.MANAGER, ROLES.ADMIN]);
        await connectDB();

        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { message: "orderId and status required" },
                { status: 400 }
            );
        }

        const allowedStatuses = [
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { message: "Invalid status" },
                { status: 400 }
            );
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        // ❌ Manager cannot cancel orders
        if (user.role === ROLES.MANAGER && status === "CANCELLED") {
            return NextResponse.json(
                { message: "Only admin can cancel orders" },
                { status: 403 }
            );
        }

        order.status = status;
        await order.save();

        // 📧 Send email notifications
        const customer = await User.findById(order.userId);

        if (customer?.email) {
            try {
                if (status === "SHIPPED") {
                    await sendOrderShippedEmail(order, customer.email);
                }

                if (status === "DELIVERED") {
                    await sendOrderDeliveredEmail(order, customer.email);
                }
            } catch (emailErr) {
                console.error("❌ Failed to send order status email", emailErr);
            }
        }

        return NextResponse.json({
            message: "Order status updated",
            order,
        });
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
