"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    async function loadOrders() {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Failed to load orders", "error");
                return;
            }

            setOrders(data.orders || []);
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    }

    async function payNow(orderId) {
        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Payment init failed", "error");
                return;
            }

            // Redirect to provider checkout (Stripe or others)
            window.location.href = data.checkoutUrl;
        } catch {
            showToast("Network error", "error");
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) {
        return <LoadingSpinner center />;
    }

    if (orders.length === 0) {
        return <p className="opacity-70">No orders yet.</p>;
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order._id} className="card bg-base-100 shadow">
                    <div className="card-body">
                        {/* HEADER */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-bold">
                                    Order #{order._id.slice(-6)}
                                </div>
                                <div className="text-sm opacity-70">
                                    {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className="badge badge-outline">
                                    Order: {order.status}
                                </span>

                                <span
                                    className={`badge ${order.payment?.status === "PAID"
                                            ? "badge-success"
                                            : order.payment?.status === "FAILED"
                                                ? "badge-error"
                                                : "badge-warning"
                                        }`}
                                >
                                    Payment: {order.payment?.status || "PENDING"}
                                </span>
                            </div>

                        </div>

                        {/* ITEMS */}
                        <ul className="mt-3 space-y-1 text-sm">
                            {order.items.map((it, idx) => (
                                <li key={idx}>
                                    {it.titleSnapshot} × {it.qty}
                                </li>
                            ))}
                        </ul>

                        {/* FOOTER */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="font-bold text-lg">
                                {order.currency.toUpperCase()}{" "}
                                {order.subtotal.toFixed(2)}
                            </div>

                            {/* PAY NOW */}
                            {order.status === "CREATED" &&
                                order.payment?.status !== "PAID" && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => payNow(order._id)}
                                    >
                                        Pay Now
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
