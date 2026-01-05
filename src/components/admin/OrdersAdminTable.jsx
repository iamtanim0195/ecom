"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrdersAdminTable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const { showToast } = useToast();

    async function loadOrders() {
        try {
            const res = await fetch("/api/admin/orders");
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

    async function updateStatus(orderId, status) {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Update failed", "error");
                return;
            }

            showToast("Order status updated", "success");
            loadOrders();
        } catch {
            showToast("Network error", "error");
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) return <LoadingSpinner center />;

    return (
        <div className="overflow-x-auto bg-base-100 shadow rounded">
            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Order Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr key={o._id}>
                            {/* ORDER ID */}
                            <td className="font-mono">#{o._id.slice(-6)}</td>

                            {/* USER */}
                            <td>{o.userId?.email || "—"}</td>

                            {/* TOTAL */}
                            <td className="font-semibold">
                                {o.currency.toUpperCase()} {o.subtotal.toFixed(2)}
                            </td>

                            {/* ORDER STATUS */}
                            <td>
                                <span className="badge badge-outline">
                                    {o.status}
                                </span>
                            </td>

                            {/* PAYMENT STATUS */}
                            <td>
                                <span
                                    className={`badge ${o.payment?.status === "PAID"
                                            ? "badge-success"
                                            : o.payment?.status === "FAILED"
                                                ? "badge-error"
                                                : "badge-warning"
                                        }`}
                                >
                                    {o.payment?.status || "PENDING"}
                                </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="flex flex-wrap gap-1">
                                {/* CONFIRMED → SHIPPED */}
                                {o.status === "CONFIRMED" && (
                                    <button
                                        className="btn btn-xs"
                                        onClick={() =>
                                            updateStatus(o._id, "SHIPPED")
                                        }
                                    >
                                        Mark Shipped
                                    </button>
                                )}

                                {/* SHIPPED → OUT_FOR_DELIVERY */}
                                {o.status === "SHIPPED" && (
                                    <button
                                        className="btn btn-xs"
                                        onClick={() =>
                                            updateStatus(o._id, "OUT_FOR_DELIVERY")
                                        }
                                    >
                                        Out for Delivery
                                    </button>
                                )}

                                {/* OUT_FOR_DELIVERY → DELIVERED */}
                                {o.status === "OUT_FOR_DELIVERY" && (
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() =>
                                            updateStatus(o._id, "DELIVERED")
                                        }
                                    >
                                        Delivered
                                    </button>
                                )}

                                {/* ADMIN ONLY — CANCEL */}
                                {session?.user?.role === "ADMIN" &&
                                    o.status !== "DELIVERED" &&
                                    o.status !== "CANCELLED" && (
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() =>
                                                updateStatus(o._id, "CANCELLED")
                                            }
                                        >
                                            Cancel
                                        </button>
                                    )}
                            </td>
                        </tr>
                    ))}

                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center opacity-60">
                                No orders found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
