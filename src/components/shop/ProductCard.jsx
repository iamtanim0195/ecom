"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductCard({ product }) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { refreshCart } = useCart();

    async function addToCart(e) {
        e.preventDefault(); // prevent link navigation
        e.stopPropagation();

        setLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product._id,
                    qty: 1,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data?.message || "Failed to add", "error");
                return;
            }

            showToast("Added to cart", "success");
            refreshCart();
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    }

    const price = product.salePrice || product.price;

    return (
        <Link
            href={`/shop/${product.slug}`}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-lg"
        >
            {/* IMAGE */}
            <figure className="relative w-full h-48 bg-gray-100">
                <Image
                    src={product.images?.[0] || "/placeholder.png"} // Show first image or fallback if none
                    alt={product.title}
                    fill
                    className="object-cover rounded-t-lg"
                />

                {/* STOCK BADGE */}
                {product.stock <= 0 && (
                    <span className="badge badge-error absolute top-2 left-2">
                        Out of stock
                    </span>
                )}
            </figure>

            {/* CONTENT */}
            <div className="card-body p-4 flex flex-col">
                <h2 className="font-semibold text-lg line-clamp-2 mb-0">{product.title}</h2>

                {/* CATEGORY */}
                {product.category && (
                    <p className="text-xs opacity-60 mb-0">{product.category}</p>
                )}

                {/* RATING */}
                <div className="flex items-center gap-1 text-sm opacity-70 mb-0">
                    <span className="text-yellow-500">⭐</span>
                    <span>{product.avgRating?.toFixed(1) || "0.0"}</span>
                    <span className="opacity-60">({product.reviewCount || 0})</span>
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2 mt-0 mb-0">
                    {product.salePrice ? (
                        <>
                            <span className="text-lg font-semibold">
                                {product.currency.toUpperCase()} {product.salePrice}
                            </span>
                            <span className="line-through opacity-50 text-sm">
                                {product.currency.toUpperCase()} {product.price}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-semibold">
                            {product.currency.toUpperCase()} {product.price}
                        </span>
                    )}
                </div>

                {/* ACTION */}
                <button
                    className="btn btn-primary btn-sm mt-0 w-full"
                    onClick={addToCart}
                    disabled={loading || product.stock <= 0}
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </Link>
    );
}
