// src/app/api/logo/route.js

import { NextResponse } from "next/server";  // Import NextResponse
import connectDB from "@/lib/db"; // Import database connection
import UIImage from "@/models/UIImage"; // Import your model

// Handle POST request (to save the logo)
export async function POST(req) {
    await connectDB(); // Connect to the database

    try {
        const { type, url, publicId } = await req.json(); // Parse JSON from the request

        // Check for missing fields
        if (!type || !url || !publicId) {
            return NextResponse.json({ message: "Type, URL, and Public ID are required" }, { status: 400 });
        }

        // Ensure the type is 'logo'
        if (type !== "logo") {
            return NextResponse.json({ message: "Invalid type. Only 'logo' type is allowed." }, { status: 400 });
        }

        // Create a new document for the logo in the database
        const newImage = new UIImage({
            type,
            url,
            publicId,
        });

        // Save the image document in MongoDB
        await newImage.save();

        // Respond with the saved data
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("Error saving logo to database:", error);
        return NextResponse.json({ message: "Failed to save logo", error: error.message }, { status: 500 });
    }
}

// Handle GET request (to fetch the logo)
export async function GET() {
    await connectDB(); // Connect to the database

    try {
        // Fetch the logo from the database
        const logo = await UIImage.findOne({ type: "logo" }).exec(); // Find the logo in the database

        if (!logo) {
            return NextResponse.json({ message: "Logo not found" }, { status: 404 });
        }

        // Respond with the logo data
        return NextResponse.json(logo, { status: 200 });
    } catch (error) {
        console.error("Error fetching logo from database:", error);
        return NextResponse.json({ message: "Failed to fetch logo", error: error.message }, { status: 500 });
    }
}
