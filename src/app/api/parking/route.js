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
        { message: "placeName is required" },
        { status: 400 }
      );
    }

    const parking = await Parking.findOne({
      placeName: { $regex: new RegExp(`^${placeName.trim()}$`, "i") },
    });

    if (!parking) {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json(parking, { status: 200 });
  } catch (err) {
    console.error("Parking GET error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDb();

    const token = cookies().get("userToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const {
      placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
    } = await req.json();

    const parking = await Parking.findOne({
      placeName: placeName.trim().toUpperCase(),
    });

    if (!parking) {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 });
    }
    console.log(
  "slotNumber required?",
  Booking.schema.paths.slotNumber.isRequired
);

    const booking = await Booking.create({
      userId,
      parkingId: parking._id,
      placeName: parking.placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return NextResponse.json(
      {
        bookingId: booking._id,
        message: "Booking created. Proceed to payment.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

