import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "Bike"],
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
    userName: String,
    phoneNumber: String,
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"],
      default: "PENDING",
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
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
