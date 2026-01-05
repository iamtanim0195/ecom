import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/authGuard";

import Cart from "@/models/Cart";
import Product from "@/models/Product";

// Helper: compute totals safely
function computeCartSummary(cart) {
    const subtotal = cart.items.reduce((sum, it) => sum + it.priceSnapshot * it.qty, 0);
    const totalItems = cart.items.reduce((sum, it) => sum + it.qty, 0);

    return {
        subtotal,
        totalItems,
        currency: cart.currency || "usd",
    };
}

// GET: get current user's cart
export async function GET() {
    try {
        const user = await requireAuth(); // any logged-in user
        await connectDB();

        const userId = new mongoose.Types.ObjectId(user.id);

        let cart = await Cart.findOne({ userId }).lean();
        if (!cart) {
            cart = await Cart.create({ userId, items: [], currency: "usd" });
            cart = cart.toObject();
        }

        return NextResponse.json(
            { cart, summary: computeCartSummary(cart) },
            { status: 200 }
        );
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST: add item to cart { productId, qty }
export async function POST(req) {
    try {
        const user = await requireAuth();
        await connectDB();

        const { productId, qty } = await req.json();

        if (!productId) {
            return NextResponse.json({ message: "productId is required" }, { status: 400 });
        }

        const addQty = Math.max(parseInt(qty || 1, 10), 1);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ message: "Invalid productId" }, { status: 400 });
        }

        const product = await Product.findOne({ _id: productId, isActive: true })
            .select("title slug price currency images stock")
            .lean();

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Optional: stock check
        if (product.stock === 0) {
            return NextResponse.json({ message: "Out of stock" }, { status: 409 });
        }

        const userId = new mongoose.Types.ObjectId(user.id);

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = await Cart.create({ userId, items: [], currency: product.currency || "usd" });

        const existing = cart.items.find((it) => String(it.productId) === String(product._id));
        const newQty = Math.min((existing?.qty || 0) + addQty, product.stock ?? 999999);

        if (existing) {
            existing.qty = newQty;
            // Keep snapshots stable (or update title/image if you want—production choice)
        } else {
            cart.items.push({
                productId: product._id,
                qty: newQty,
                priceSnapshot: product.price,
                titleSnapshot: product.title,
                slugSnapshot: product.slug,
                imageSnapshot: product.images?.[0] || "",
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        const leanCart = cart.toObject();
        return NextResponse.json(
            { message: "Added to cart", cart: leanCart, summary: computeCartSummary(leanCart) },
            { status: 200 }
        );
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH: update qty { productId, qty }
export async function PATCH(req) {
    try {
        const user = await requireAuth();
        await connectDB();

        const { productId, qty } = await req.json();

        if (!productId) return NextResponse.json({ message: "productId is required" }, { status: 400 });
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ message: "Invalid productId" }, { status: 400 });
        }

        const newQty = parseInt(qty, 10);
        if (!Number.isInteger(newQty) || newQty < 1) {
            return NextResponse.json({ message: "qty must be integer >= 1" }, { status: 400 });
        }

        const userId = new mongoose.Types.ObjectId(user.id);
        const cart = await Cart.findOne({ userId });
        if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

        const item = cart.items.find((it) => String(it.productId) === String(productId));
        if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

        // Stock cap (optional but recommended)
        const product = await Product.findById(productId).select("stock isActive").lean();
        if (!product || !product.isActive) {
            return NextResponse.json({ message: "Product unavailable" }, { status: 409 });
        }
        item.qty = Math.min(newQty, product.stock ?? newQty);

        cart.updatedAt = new Date();
        await cart.save();

        const leanCart = cart.toObject();
        return NextResponse.json(
            { message: "Cart updated", cart: leanCart, summary: computeCartSummary(leanCart) },
            { status: 200 }
        );
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE: remove item { productId } or clear cart { clear: true }
export async function DELETE(req) {
    try {
        const user = await requireAuth();
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { productId, clear } = body;

        const userId = new mongoose.Types.ObjectId(user.id);
        const cart = await Cart.findOne({ userId });
        if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

        if (clear) {
            cart.items = [];
            cart.updatedAt = new Date();
            await cart.save();
            const leanCart = cart.toObject();
            return NextResponse.json(
                { message: "Cart cleared", cart: leanCart, summary: computeCartSummary(leanCart) },
                { status: 200 }
            );
        }

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ message: "Valid productId is required" }, { status: 400 });
        }

        cart.items = cart.items.filter((it) => String(it.productId) !== String(productId));
        cart.updatedAt = new Date();
        await cart.save();

        const leanCart = cart.toObject();
        return NextResponse.json(
            { message: "Item removed", cart: leanCart, summary: computeCartSummary(leanCart) },
            { status: 200 }
        );
    } catch (err) {
        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
