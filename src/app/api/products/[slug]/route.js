import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
    try {
        // Unwrap params to access the dynamic `slug`
        const { slug } = await params; // Await params before destructuring

        await connectDB(); // Connect to MongoDB

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (err) {
        console.error("Error fetching product:", err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
