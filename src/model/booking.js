import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking',
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike'],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    slotNumber: {
      type: Number,
      required: true,
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
    spotsBooked: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;
