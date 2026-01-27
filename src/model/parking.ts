import mongoose, { Schema, Document, Types } from "mongoose";

export interface IParking extends Document {
  placeName: string;
  totalSlotsOfCar: number;
  totalSlotsOfBike: number;
  bookedSlotsOfCar: number[];
  bookedSlotsOfBike: number[];
  ownerId: Types.ObjectId;

  availableSlotsOfCar: number;
  availableSlotsOfBike: number;
}

const ParkingSchema = new Schema<IParking>(
  {
    placeName: {
      type: String,
      required: true,
      unique: true,
      set: (v: string) => v.toUpperCase(),
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
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ParkingSchema.virtual("availableSlotsOfCar").get(function (this: IParking) {
  return this.totalSlotsOfCar - this.bookedSlotsOfCar.length;
});

ParkingSchema.virtual("availableSlotsOfBike").get(function (this: IParking) {
  return this.totalSlotsOfBike - this.bookedSlotsOfBike.length;
});

const Parking =
  mongoose.models.Parking ||
  mongoose.model<IParking>("Parking", ParkingSchema);

export default Parking;
