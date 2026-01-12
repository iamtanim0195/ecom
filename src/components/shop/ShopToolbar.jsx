"use client";

import SearchBar from "./SearchBar";
import SortSelect from "./SortSelect";
import CategoryFilter from "./CategoryFilter";

export default function ShopToolbar() {
    return (
        <div className="card bg-base-100 shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SearchBar />
                <CategoryFilter />
                <SortSelect />
            </div>
        </div>
    );
}
