import mongoose from 'mongoose';

const ParkingSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
    unique: true,
    set: (value) => value.toUpperCase(),
  },
  totalSlotsOfCar: {
    type: Number,
    required: true,
  },
  totalSlotsOfBike: {
    type: Number,
    required: true,
  },
  bookedSlotsOfCar: {
    type: [Number],
    default: [],
  },
  bookedSlotsOfBike: {
    type: [Number],
    default: [],
  },
  availableSlotsOfCar: {
    type: Number,
    required: true,
    default: function () {
      return this.totalSlotsOfCar - this.bookedSlotsOfCar.length;
    },
  },
  availableSlotsOfBike: {
    type: Number,
    required: true,
    default: function () {
      return this.totalSlotsOfBike - this.bookedSlotsOfBike.length;
    },
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
});

const Parking = mongoose.models.Parking || mongoose.model("Parking", ParkingSchema);
export default Parking;
