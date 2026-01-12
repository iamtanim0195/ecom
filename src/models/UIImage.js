import mongoose from "mongoose";

const UIImageSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["logo", "banner"],  // You can extend this list as needed
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.UIImage || mongoose.model("UIImage", UIImageSchema);
