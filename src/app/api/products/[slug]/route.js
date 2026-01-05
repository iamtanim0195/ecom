import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (err) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
