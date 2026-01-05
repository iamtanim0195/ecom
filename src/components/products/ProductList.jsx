"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductList() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const res = await fetch("/api/products?limit=20&page=1");
                const data = await res.json();
                if (!ignore) setItems(data.items || []);
            } catch {
                if (!ignore) setItems([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body">
                <h2 className="card-title">Recent Products</h2>

                {loading ? (
                    <LoadingSpinner center />
                ) : items.length === 0 ? (
                    <p className="opacity-70">No products found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((p) => (
                                    <tr key={p._id}>
                                        <td className="font-medium">{p.title}</td>
                                        <td>
                                            {p.currency?.toUpperCase()} {p.price}
                                        </td>
                                        <td>{p.stock}</td>
                                        <td>{p.category || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
