import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, index: true },
        slug: { type: String, required: true, unique: true, index: true },

        description: { type: String, default: "" },

        price: { type: Number, required: true, min: 0 }, // store in normal currency units for now
        currency: { type: String, default: "usd" },

        images: [{ type: String }], // later we’ll integrate upload + CDN

        category: { type: String, default: "", index: true },

        stock: { type: Number, default: 0, min: 0 },

        isActive: { type: Boolean, default: true, index: true },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
