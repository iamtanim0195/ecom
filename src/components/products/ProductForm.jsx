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
            stock: Number(form.get("stock")),
            category: form.get("category"),
            description: form.get("description"),
            currency: "usd",
            images,
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data?.error || data?.message || "Failed", "error");
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

                <input
                    name="title"
                    className="input input-bordered"
                    placeholder="Title"
                    required
                />

                <div className="grid grid-cols-2 gap-3">
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        placeholder="Price"
                        required
                    />
                    <input
                        name="stock"
                        type="number"
                        className="input input-bordered"
                        placeholder="Stock"
                        defaultValue={0}
                        min={0}
                    />
                </div>

                <input
                    name="category"
                    className="input input-bordered"
                    placeholder="Category (optional)"
                />

                <textarea
                    name="description"
                    className="textarea textarea-bordered"
                    placeholder="Description (optional)"
                />

                <div className="space-y-2">
                    <label className="font-medium text-sm">Product Images</label>

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
