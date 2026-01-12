"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";
import ImageUploader from "@/components/ui/ImageUploader";

export default function ProductForm() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [images, setImages] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const payload = {
            title: form.get("title"),
            price: Number(form.get("price")),
            salePrice: form.get("salePrice")
                ? Number(form.get("salePrice"))
                : null,

            stock: Number(form.get("stock")),
            manageStock: true,

            categories: form
                .get("categories")
                ?.split(",")
                .map((c) => c.trim())
                .filter(Boolean),

            tags: form
                .get("tags")
                ?.split(",")
                .map((t) => t.trim())
                .filter(Boolean),

            description: form.get("description"),
            shortDescription: form.get("shortDescription"),

            status: form.get("status"),
            visibility: form.get("visibility"),

            currency: "usd",

            featuredImage: images[0] || "",
            galleryImages: images.slice(1),
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data?.error || "Failed to create product", "error");
                return;
            }

            showToast("✅ Product created successfully", "success");
            e.currentTarget.reset();
            setImages([]);
            window.location.reload();
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card bg-base-100 shadow">
            <form onSubmit={handleSubmit} className="card-body gap-4">
                <h2 className="card-title">Add Product</h2>

                {/* Title */}
                <input
                    name="title"
                    className="input input-bordered"
                    placeholder="Product Title"
                    required
                />

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        placeholder="Regular Price"
                        required
                    />
                    <input
                        name="salePrice"
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        placeholder="Sale Price (optional)"
                    />
                </div>

                {/* Stock */}
                <input
                    name="stock"
                    type="number"
                    className="input input-bordered"
                    placeholder="Stock Quantity"
                    defaultValue={0}
                    min={0}
                />

                {/* Categories & Tags */}
                <input
                    name="categories"
                    className="input input-bordered"
                    placeholder="Categories (comma separated)"
                />

                <input
                    name="tags"
                    className="input input-bordered"
                    placeholder="Tags (comma separated)"
                />

                {/* Descriptions */}
                <textarea
                    name="shortDescription"
                    className="textarea textarea-bordered"
                    placeholder="Short description"
                />

                <textarea
                    name="description"
                    className="textarea textarea-bordered"
                    placeholder="Full description"
                />

                {/* Status & Visibility */}
                <div className="grid grid-cols-2 gap-3">
                    <select
                        name="status"
                        className="select select-bordered"
                        defaultValue="draft"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>

                    <select
                        name="visibility"
                        className="select select-bordered"
                        defaultValue="public"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                {/* Images */}
                <div className="space-y-2">
                    <label className="font-medium text-sm">
                        Product Images (first = featured)
                    </label>

                    <ImageUploader
                        onUpload={(img) =>
                            setImages((prev) => [...prev, img.url])
                        }
                    />

                    {images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {images.map((url, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={url}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-error absolute -top-2 -right-2"
                                        onClick={() =>
                                            setImages((prev) =>
                                                prev.filter((_, i) => i !== idx)
                                            )
                                        }
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <LoadingSpinner size="sm" /> Creating...
                        </span>
                    ) : (
                        "Create Product"
                    )}
                </button>
            </form>
        </div>
    );
}
