"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductCard({ product }) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { refreshCart } = useCart();

    async function addToCart() {
        setLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id, qty: 1 }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Failed to add", "error");
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

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">{product.title}</h2>
                <p className="opacity-70">{product.category}</p>

                <p className="font-bold mt-2">
                    {product.currency.toUpperCase()} {product.price}
                </p>

                <button
                    className="btn btn-primary btn-sm mt-3"
                    onClick={addToCart}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}
