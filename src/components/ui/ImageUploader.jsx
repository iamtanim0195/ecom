"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ImageUploader({ onUpload }) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Upload failed", "error");
                return;
            }

            onUpload(data); // { url, publicId }
            showToast("Image uploaded", "success");
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-2">
            <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
                disabled={loading}
            />
            {loading && <p className="text-sm opacity-70">Uploading…</p>}
        </div>
    );
}
