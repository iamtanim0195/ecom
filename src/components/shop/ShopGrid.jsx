import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

/**
 * Server Component
 * Fetches products and renders shop grid
 */
async function getProducts() {
    await connectDB();

    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .lean();

    return products;
}

export default async function ShopGrid() {
    const products = await getProducts();

    if (!products || products.length === 0) {
        return (
            <div className="text-center opacity-70">
                No products available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
                <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="card bg-base-100 shadow hover:shadow-lg transition"
                >
                    {/* IMAGE */}
                    <figure>
                        <img
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.title}
                            className="h-52 w-full object-cover"
                        />
                    </figure>

                    {/* CONTENT */}
                    <div className="card-body">
                        <h2 className="card-title">{product.title}</h2>

                        {/* RATING */}
                        <div className="flex items-center gap-1 text-sm">
                            ⭐ {product.avgRating?.toFixed(1) || "0.0"}
                            <span className="opacity-60">
                                ({product.reviewCount || 0})
                            </span>
                        </div>

                        {/* PRICE */}
                        <p className="text-lg font-semibold">
                            {product.currency.toUpperCase()} {product.price}
                        </p>

                        {/* STOCK */}
                        <p
                            className={`text-sm ${product.stock > 0
                                    ? "text-success"
                                    : "text-error"
                                }`}
                        >
                            {product.stock > 0 ? "In stock" : "Out of stock"}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
