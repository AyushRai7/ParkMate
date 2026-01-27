import mongoose, { Schema, Document } from "mongoose";

export interface IOwner extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const OwnerSchema = new Schema<IOwner>(
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

const Owner =
  mongoose.models.Owner ||
  mongoose.model<IOwner>("Owner", OwnerSchema);

export default Owner;
