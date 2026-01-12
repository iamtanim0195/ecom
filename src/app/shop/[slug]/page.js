import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Image from "next/image";

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;

    await connectDB();

    const product = await Product.findOne({
        slug,
        isActive: true,
    }).lean();

    if (!product) {
        console.log("Product not found with slug:", slug); // Log if the product is not found
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-8">
            {/* IMAGE SECTION */}
            <div className="space-y-3">
                <figure className="border rounded w-full h-96">
                    <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className=" object-contain"
                    />
                </figure>

                {product.images?.length > 1 && (
                    <div className="flex gap-2">
                        {product.images.map((img, i) => (
                            <Image
                                key={i}
                                src={img}
                                alt="Product Image"
                                className="w-20 h-20 object-cover border rounded"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PRODUCT INFO */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">{product.title}</h1>

                {/* RATING */}
                <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span>{product.avgRating?.toFixed(1) || "0.0"}</span>
                    <span className="opacity-60">
                        ({product.reviewCount || 0} reviews)
                    </span>
                </div>

                <div className="text-2xl font-semibold">
                    {product.currency.toUpperCase()} {product.price}
                </div>

                {product.description && (
                    <p className="opacity-80">{product.description}</p>
                )}

                <p className="text-sm">
                    Stock:{" "}
                    <span
                        className={
                            product.stock > 0 ? "text-success" : "text-error"
                        }
                    >
                        {product.stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                </p>

                {/* Add To Cart Button */}
                <AddToCartButton
                    productId={product._id.toString()}
                    disabled={product.stock === 0}
                />
            </div>

            {/* REVIEWS */}
            <div className="md:col-span-2 mt-10 space-y-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>

                <ReviewForm productId={product._id.toString()} />

                <ReviewList productId={product._id.toString()} />
            </div>
        </div>
    );
}
