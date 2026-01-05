import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

// one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review ||
    mongoose.model("Review", ReviewSchema);
