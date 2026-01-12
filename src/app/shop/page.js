import ShopGrid from "@/components/shop/ShopGrid";
import ShopToolbar from "@/components/shop/ShopToolbar";

export default function ShopPage({ searchParams }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Shop</h1>
                <p className="text-sm opacity-70">
                    Browse our latest products
                </p>
            </div>

            {/* TOOLBAR */}
            <ShopToolbar />

            {/* PRODUCTS */}
            <ShopGrid searchParams={searchParams} />
        </div>
    );
}
