"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const params = useSearchParams();

    function onSearch(e) {
        const value = e.target.value;
        const q = new URLSearchParams(params);
        value ? q.set("q", value) : q.delete("q");
        router.push(`/shop?${q.toString()}`);
    }

    return (
        <input
            type="search"
            placeholder="Search products..."
            defaultValue={params.get("q") || ""}
            onChange={onSearch}
            className="input input-bordered w-full"
        />
    );
}
