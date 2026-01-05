import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        qty: { type: Number, required: true, min: 1 },
        priceSnapshot: { type: Number, required: true, min: 0 }, // price at add time
        titleSnapshot: { type: String, required: true, trim: true },
        imageSnapshot: { type: String, default: "" },
        slugSnapshot: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // 1 cart per user
            index: true,
        },
        items: { type: [CartItemSchema], default: [] },
        currency: { type: String, default: "usd" },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
