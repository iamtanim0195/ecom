import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        titleSnapshot: { type: String, required: true },
        slugSnapshot: { type: String, required: true },
        priceSnapshot: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        items: { type: [OrderItemSchema], required: true },

        subtotal: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "usd" },

        status: {
            type: String,
            enum: ["CREATED", "PAID", "CANCELLED"],
            default: "CREATED",
            index: true,
        },

        payment: {
            provider: { type: String, default: "" },
            sessionId: { type: String, default: "" },
            status: {
                type: String,
                enum: [
                    "CREATED",           // order created
                    "CONFIRMED",         // payment verified
                    "SHIPPED",           // packed & shipped
                    "OUT_FOR_DELIVERY",  // with delivery agent
                    "DELIVERED",         // delivered
                    "CANCELLED",
                ],
                default: "CREATED",
                index: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
