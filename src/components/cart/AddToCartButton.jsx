"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCartButton({ productId, disabled }) {
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();
    const { showToast } = useToast();

    async function addToCart() {
        setLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, qty: 1 }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Failed", "error");
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
        <button
            className="btn btn-primary"
            disabled={disabled || loading}
            onClick={addToCart}
        >
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
}
