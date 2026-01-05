"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ReviewForm({ productId, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { showToast } = useToast();

    async function submitReview(e) {
        e.preventDefault();

        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, rating, comment }),
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Failed", "error");
            return;
        }

        showToast("Review submitted", "success");
        setComment("");
        onSuccess?.();
    }

    return (
        <form onSubmit={submitReview} className="space-y-2">
            <label className="font-medium">Your Rating</label>

            <select
                className="select select-bordered"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
            >
                {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                        {n} Star{n > 1 && "s"}
                    </option>
                ))}
            </select>

            <textarea
                className="textarea textarea-bordered"
                placeholder="Write a review (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button className="btn btn-primary btn-sm">
                Submit Review
            </button>
        </form>
    );
}
