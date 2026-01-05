import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/authGuard";
import { ROLES } from "@/lib/roles";

// GET → list users
export async function GET() {
    try {
        await requireAuth(ROLES.ADMIN);
        await connectDB();

        const users = await User.find({})
            .select("name email role isActive createdAt")
            .sort({ createdAt: -1 });

        return NextResponse.json({ users });
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

// PATCH → update role / status
export async function PATCH(req) {
    try {
        await requireAuth(ROLES.ADMIN);
        await connectDB();

        const { userId, role, isActive } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { message: "User ID required" },
                { status: 400 }
            );
        }

        const update = {};
        if (role) update.role = role;
        if (typeof isActive === "boolean") update.isActive = isActive;

        const updated = await User.findByIdAndUpdate(
            userId,
            update,
            { new: true }
        ).select("name email role isActive");

        if (!updated) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User updated",
            user: updated,
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
