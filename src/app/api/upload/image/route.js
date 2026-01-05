import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { ROLES } from "@/lib/roles";
import { getImageProvider } from "@/lib/uploads";

export const runtime = "nodejs"; // IMPORTANT for Cloudinary

export async function POST(req) {
    try {
        await requireAuth(ROLES.MANAGER);

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const imageProvider = getImageProvider();
        const result = await imageProvider.uploadImage(buffer);

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error("IMAGE UPLOAD ERROR:", err);
        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        );
    }
}
