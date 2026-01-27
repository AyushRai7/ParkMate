import mongoose, { Schema, Document, Types } from "mongoose";

export enum VehicleType {
  CAR = "Car",
  BIKE = "Bike",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface IBooking extends Document {
  userId: Types.ObjectId;
  parkingId: Types.ObjectId;
  vehicleType: VehicleType;
  vehicleNumber: string;
  slotNumber: number | null;
  placeName: string;
  userName?: string;
  phoneNumber?: string;
  status: BookingStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingId: {
      type: Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    slotNumber: {
      type: Number,
      default: null,
    },
    placeName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
