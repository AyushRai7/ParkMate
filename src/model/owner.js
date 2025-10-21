import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: /^\+?[1-9]\d{1,14}$/,
        },
    },
    { timestamps: true }
);

const Owner = mongoose.models.Owner || mongoose.model("Owner", OwnerSchema);

export default Owner;
