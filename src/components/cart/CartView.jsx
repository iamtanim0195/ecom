"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/components/cart/CartProvider";

export default function CartView() {
    const { cart, summary, loading, refreshCart } = useCart();
    const { showToast } = useToast();

    async function updateQty(productId, qty) {
        try {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, qty }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Update failed", "error");
                return;
            }

            refreshCart();
        } catch {
            showToast("Network error", "error");
        }
    }

    async function removeItem(productId) {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Remove failed", "error");
                return;
            }

            showToast("Item removed", "success");
            refreshCart();
        } catch {
            showToast("Network error", "error");
        }
    }

    async function clearCart() {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clear: true }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Clear failed", "error");
                return;
            }

            showToast("Cart cleared", "success");
            refreshCart();
        } catch {
            showToast("Network error", "error");
        }
    }

    // ✅ PART 7.5 — CREATE ORDER FROM CART
    async function handleCheckout() {
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || "Failed to create order", "error");
                return;
            }

            showToast("Order created successfully", "success");

            // Cart is cleared on backend, refresh local state
            refreshCart();

            // Redirect to orders page
            window.location.href = "/dashboard/orders";
        } catch {
            showToast("Network error", "error");
        }
    }

    if (loading) return <LoadingSpinner center />;

    const items = cart?.items || [];

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between">
                <h1 className="text-2xl font-bold">Your Cart</h1>
                <button
                    className="btn btn-outline btn-sm"
                    onClick={clearCart}
                    disabled={items.length === 0}
                >
                    Clear cart
                </button>
            </div>

            {items.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <p className="opacity-70">Your cart is empty.</p>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 shadow">
                    <div className="card-body overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((it) => (
                                    <tr key={it.productId}>
                                        <td>{it.titleSnapshot}</td>
                                        <td>
                                            {cart.currency.toUpperCase()} {it.priceSnapshot}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min={1}
                                                className="input input-bordered input-sm w-20"
                                                value={it.qty}
                                                onChange={(e) =>
                                                    updateQty(it.productId, e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            {(it.priceSnapshot * it.qty).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => removeItem(it.productId)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* SUBTOTAL + CHECKOUT */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="font-bold text-lg">
                                Subtotal: {summary.currency.toUpperCase()}{" "}
                                {summary.subtotal.toFixed(2)}
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
