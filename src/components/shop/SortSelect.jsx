"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
    const router = useRouter();
    const params = useSearchParams();

    function onSort(value) {
        const q = new URLSearchParams(params);
        q.set("sort", value);
        router.push(`/shop?${q.toString()}`);
    }

    return (
        <select
            className="select select-bordered w-full"
            defaultValue={params.get("sort") || "newest"}
            onChange={(e) => onSort(e.target.value)}
        >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
        </select>
    );
}
