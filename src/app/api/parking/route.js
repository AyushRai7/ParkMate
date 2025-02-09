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
        { message: "Mall name is required" },
        { status: 400 }
      );
    }

    const placeNameClean = placeName.trim().toUpperCase(); // Convert input to uppercase
    const parking = await Parking.findOne({
      placeName: { $regex: new RegExp(`^${placeNameClean}$`, "i") },
    });

    if (!parking) {
      return NextResponse.json({ message: "Mall not found" }, { status: 404 });
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
    console.log("Connecting to DB...");
    await connectDb();
    console.log("Connected to MongoDB...");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("Extracted Token:", token);
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    console.log("Token Decoded Successfully:", decoded);
    const userId = decoded.id;
    const body = await req.json();
    console.log("Request Body:", body);

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
      !vehicleNumber ||
      !vehicleType ||
      !timeSlot ||
      !phoneNumber ||
      !userName
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const parking = await Parking.findOne({ placeName });
    console.log("Parking Data:", parking);
    if (!parking) {
      return NextResponse.json({ message: "Mall not found" }, { status: 404 });
    }

    if (parking.availableSlots < 1) {
      return NextResponse.json(
        { message: "No available slots" },
        { status: 400 }
      );
    }

    // Find the next available slot number
    const nextSlot = parking.bookedSlots.length + 1;

    // Create a new booking
    const newBooking = new Booking({
      userId,
      parkingId: parking._id,
      vehicleNumber,
      vehicleType,
      timeSlot,
      slotNumber: `P${nextSlot}`, // Format slot as 'P11'
    });

    // Save the booking
    await newBooking.save();

    // Update parking details
    parking.bookedSlots.push(nextSlot);
    parking.availableSlots = parking.totalSlots - parking.bookedSlots.length;

    // Save updated parking data
    const updatedParking = await parking.save();
    console.log("Updated Parking Data:", updatedParking);

    return NextResponse.json(
      {
        message: `P${nextSlot} slot is booked`,
        remainingSlots: updatedParking.availableSlots,
        bookingDetails: newBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
