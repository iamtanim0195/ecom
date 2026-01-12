"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ShopGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        const res = await fetch(`/api/products?page=${page}&limit=20`);
        const data = await res.json();

        console.log("API Response:", data); // Log the API response to check the structure

        if (Array.isArray(data.items)) {
            setProducts(data.items);
            setTotalPages(data.pagination.totalPages); // Set total pages from API response
        } else {
            console.error("Products data is not in expected format:", data);
        }
        setLoading(false);
    };

    // Fetch products whenever the currentPage changes
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage); // Update the current page
        }
    };

    if (loading) return <div>Loading...</div>;

    if (products.length === 0) {
        return <div>No products found.</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm mx-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn btn-primary btn-sm ml-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
