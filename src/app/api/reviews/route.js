import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/authGuard";
import Review from "@/models/Review";
import Order from "@/models/Order";
import Product from "@/models/Product";

/**
 * POST — Create / Update review
 */
export async function POST(req) {
    try {
        const user = await requireAuth();
        await connectDB();

        const { productId, rating, comment } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json(
                { message: "productId and rating required" },
                { status: 400 }
            );
        }

        // ✅ Ensure user purchased this product
        const purchased = await Order.exists({
            userId: user.id,
            status: { $in: ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] },
            "items.productId": productId,
        });

        if (!purchased) {
            return NextResponse.json(
                { message: "You can only review purchased products" },
                { status: 403 }
            );
        }

        // Upsert review
        const review = await Review.findOneAndUpdate(
            { productId, userId: user.id },
            { rating, comment },
            { upsert: true, new: true }
        );

        // 🔄 Recalculate product rating
        const stats = await Review.aggregate([
            { $match: { productId: review.productId } },
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                avgRating: Number(stats[0].avgRating.toFixed(1)),
                reviewCount: stats[0].reviewCount,
            });
        }

        return NextResponse.json({
            message: "Review saved",
            review,
        });
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json(
                { message: "You already reviewed this product" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

/**
 * GET — Product reviews
 */
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { message: "productId required" },
                { status: 400 }
            );
        }

        const reviews = await Review.find({ productId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({ reviews });
    } catch {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
