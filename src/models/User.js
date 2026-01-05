import mongoose from "mongoose";

export const USER_ROLES = Object.freeze({
    USER: "USER",
    MANAGER: "MANAGER",
    ADMIN: "ADMIN",
});

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: "" },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        image: { type: String, default: "" },

        // For Credentials login (email+password)
        passwordHash: { type: String, default: "" },

        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.USER,
            index: true,
        },

        // Useful flags
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.User || mongoose.model("User", UserSchema);
