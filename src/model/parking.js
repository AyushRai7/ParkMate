import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true,
    unique: true,
    set: (v) => v.toUpperCase(),
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
  

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
});

ParkingSchema.virtual("availableSlotsOfCar").get(function () {
  return this.totalSlotsOfCar - this.bookedSlotsOfCar.length;
});

ParkingSchema.virtual("availableSlotsOfBike").get(function () {
  return this.totalSlotsOfBike - this.bookedSlotsOfBike.length;
});

ParkingSchema.set("toJSON", { virtuals: true });
ParkingSchema.set("toObject", { virtuals: true });

const Parking =
  mongoose.models.Parking || mongoose.model("Parking", ParkingSchema);

export default Parking;
