import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

import { requireAuth } from "@/lib/authGuard";
import { ROLES } from "@/lib/roles";
import slugify from "@/lib/slugify";
import { validateCreateProduct } from "@/lib/validators/product";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
        const page = Math.max(Number(searchParams.get("page") || 1), 1);
        const skip = (page - 1) * limit;

        // Public listing will be built later for shop page.
        // For now, allow listing but only active products.
        const filter = { isActive: true };

        const [items, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("title slug price currency images category stock isActive createdAt"),
            Product.countDocuments(filter),
        ]);

        return NextResponse.json(
            {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await requireAuth(ROLES.MANAGER);
        await connectDB();

        const payload = await req.json();
        const result = validateCreateProduct(payload);

        if (!result.ok) {
            return NextResponse.json(
                { message: "Validation failed", errors: result.errors },
                { status: 400 }
            );
        }

        const baseSlug = slugify(result.value.title);
        if (!baseSlug) {
            return NextResponse.json(
                { message: "Invalid title for slug" },
                { status: 400 }
            );
        }

        // Ensure unique slug (simple approach, scalable enough initially)
        let slug = baseSlug;
        let counter = 1;
        while (await Product.exists({ slug })) {
            counter += 1;
            slug = `${baseSlug}-${counter}`;
        }

        const created = await Product.create({
            ...result.value,
            slug,
            createdBy: new mongoose.Types.ObjectId(user.id),
        });

        return NextResponse.json(
            { message: "Product created", product: created },
            { status: 201 }
        );
    } catch (err) {
        console.error("❌ PRODUCT API ERROR:", err);

        if (err.message === "UNAUTHORIZED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(
            {
                message: "Server error",
                error: err.message,
            },
            { status: 500 }
        );
    }

}
