import mongoose from 'mongoose';

const ParkingSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
    unique: true,
    set: (value) => value.toUpperCase(),
  },
  totalSlots: {
    type: Number,
    required: true,
  },
  bookedSlots: {
    type: [Number], // Array of booked slot numbers
    default: [],
  },
  availableSlots: {
    type: Number,
    required: true,
    default: function () {
      // Set availableSlots to the totalSlots - bookedSlots length on creation
      return this.totalSlots - this.bookedSlots.length;
    },
  },
});

const Parking = mongoose.models.Parking || mongoose.model('Parking', ParkingSchema);
export default Parking;
