import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        // Basic product info
        title: { type: String, required: true, trim: true, index: true },
        slug: { type: String, required: true, unique: true, index: true },

        description: { type: String, default: "" }, // Full description
        shortDescription: { type: String, default: "" }, // WP "Product short description"

        // Pricing
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0, default: null },
        currency: { type: String, default: "usd" },

        // Images
        featuredImage: { type: String, default: "" }, // WP product image
        galleryImages: [{ type: String }], // WP product gallery

        // Categories & tags
        categories: [{ type: String, index: true }], // multiple categories
        tags: [{ type: String, index: true }],

        // Inventory (no SKU)
        stock: { type: Number, default: 0, min: 0 },
        manageStock: { type: Boolean, default: true },
        stockStatus: {
            type: String,
            enum: ["instock", "outofstock"],
            default: "instock",
        },

        // Product type
        productType: {
            type: String,
            enum: ["simple", "variable"],
            default: "simple",
        },

        // Attributes (for variations or filtering)
        attributes: [
            {
                name: { type: String }, // e.g. Size, Color
                values: [{ type: String }], // e.g. ["S", "M", "L"]
            },
        ],

        // Visibility & status
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            index: true,
        },

        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },

        // Reviews
        avgRating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },

        // Admin
        isActive: { type: Boolean, default: true, index: true },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Product ||
    mongoose.model("Product", ProductSchema);
