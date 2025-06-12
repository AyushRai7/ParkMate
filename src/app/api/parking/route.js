import { NextResponse } from "next/server";
import connectDb from "@/database/connection";
import Parking from "@/model/parking";
import Booking from "@/model/booking";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.nextUrl);
    const placeName = searchParams.get("placeName");

    if (!placeName) {
      return NextResponse.json(
        { message: "Venue name is required" },
        { status: 400 }
      );
    }

    const placeNameClean = placeName.trim().toUpperCase();
    const parking = await Parking.findOne({
      placeName: { $regex: new RegExp(`^${placeNameClean}$`, "i") },
    });

    if (!parking) {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json(parking, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const body = await req.json();
    const {
      placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      timeSlot,
    } = body;

    if (
      !placeName ||
      !userName ||
      !phoneNumber ||
      !vehicleNumber ||
      !vehicleType ||
      !timeSlot
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const parking = await Parking.findOne({ placeName: placeName.trim().toUpperCase() });
    if (!parking) {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    const type = vehicleType;

    let nextSlotNumber;
    if (type === "Car") {
      if (parking.availableSlotsOfCar < 1) {
        return NextResponse.json({ message: "No available car slots" }, { status: 400 });
      }

      nextSlotNumber = parking.bookedSlotsOfCar.length + 1;
      parking.bookedSlotsOfCar.push(nextSlotNumber);
      parking.availableSlotsOfCar = parking.totalSlotsOfCar - parking.bookedSlotsOfCar.length;

    } else if (type === "Bike") {
      if (parking.availableSlotsOfBike < 1) {
        return NextResponse.json({ message: "No available bike slots" }, { status: 400 });
      }

      nextSlotNumber = parking.bookedSlotsOfBike.length + 1;
      parking.bookedSlotsOfBike.push(nextSlotNumber);
      parking.availableSlotsOfBike = parking.totalSlotsOfBike - parking.bookedSlotsOfBike.length;

    } else {
      return NextResponse.json({ message: "Invalid vehicle type" }, { status: 400 });
    }

    const slotCode = `P${nextSlotNumber}`;

    const newBooking = new Booking({
      userId,
      parkingId: parking._id,
      placeName: parking.placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType: type,
      timeSlot,
      slotNumber: slotCode,
    });

    await newBooking.save();
    await parking.save();

    const remaining =
      type === "Car" ? parking.availableSlotsOfCar : parking.availableSlotsOfBike;

    return NextResponse.json(
      {
        message: `${slotCode} slot is booked`,
        bookingDetails: newBooking,
        remainingSlots: remaining,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking Error:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

