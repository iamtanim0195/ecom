import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email,
            passwordHash,
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Registration failed", error: err.message },
            { status: 500 }
        );
    }
}
