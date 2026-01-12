"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "Clothing", "Electronics", "Shoes"];

export default function CategoryFilter() {
    const router = useRouter();
    const params = useSearchParams();

    function changeCategory(cat) {
        const q = new URLSearchParams(params);
        cat === "All" ? q.delete("category") : q.set("category", cat);
        router.push(`/shop?${q.toString()}`);
    }

    return (
        <select
            className="select select-bordered w-full"
            defaultValue={params.get("category") || "All"}
            onChange={(e) => changeCategory(e.target.value)}
        >
            {categories.map((cat) => (
                <option key={cat}>{cat}</option>
            ))}
        </select>
    );
}
