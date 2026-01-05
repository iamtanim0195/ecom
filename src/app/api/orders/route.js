import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/authGuard";

import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";

// GET — list current user's orders
export async function GET() {
    try {
        const user = await requireAuth();
        await connectDB();

        const userId = new mongoose.Types.ObjectId(user.id);

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ orders }, { status: 200 });
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST — create order from cart
export async function POST() {
    try {
        const user = await requireAuth();
        await connectDB();

        const userId = new mongoose.Types.ObjectId(user.id);

        const cart = await Cart.findOne({ userId }).lean();
        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 }
            );
        }

        // Re-validate products (price & availability)
        const productIds = cart.items.map((it) => it.productId);
        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true,
        })
            .select("_id price stock")
            .lean();

        const productMap = new Map(
            products.map((p) => [String(p._id), p])
        );

        let subtotal = 0;

        const orderItems = cart.items.map((it) => {
            const p = productMap.get(String(it.productId));
            if (!p) {
                throw new Error("PRODUCT_UNAVAILABLE");
            }

            const qty = Math.min(it.qty, p.stock ?? it.qty);
            const lineTotal = it.priceSnapshot * qty;
            subtotal += lineTotal;

            return {
                productId: it.productId,
                titleSnapshot: it.titleSnapshot,
                slugSnapshot: it.slugSnapshot,
                priceSnapshot: it.priceSnapshot,
                qty,
            };
        });

        const order = await Order.create({
            userId,
            items: orderItems,
            subtotal,
            currency: cart.currency || "usd",
            status: "CREATED",
        });

        // Clear cart after order creation
        await Cart.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: new Date() }
        );

        return NextResponse.json(
            { message: "Order created", order },
            { status: 201 }
        );
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (err.message === "PRODUCT_UNAVAILABLE") {
            return NextResponse.json(
                { message: "One or more products are unavailable" },
                { status: 409 }
            );
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
