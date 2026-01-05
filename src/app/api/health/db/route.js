import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json(
            { ok: true, message: "✅ DB connected" },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { ok: false, message: "❌ DB connection failed", error: err?.message },
            { status: 500 }
        );
    }
}
