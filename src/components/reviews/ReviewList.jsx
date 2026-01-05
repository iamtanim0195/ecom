"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadReviews() {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setLoading(false);
    }

    useEffect(() => {
        loadReviews();
    }, [productId]);

    if (loading) return <LoadingSpinner />;

    if (reviews.length === 0) {
        return <p className="opacity-60">No reviews yet.</p>;
    }

    return (
        <div className="space-y-3">
            {reviews.map((r) => (
                <div key={r._id} className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="flex justify-between">
                            <div className="font-semibold">
                                {r.userId?.email}
                            </div>
                            <div className="badge badge-warning">
                                ⭐ {r.rating}
                            </div>
                        </div>
                        {r.comment && <p>{r.comment}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}
