import { NextResponse } from "next/server";
import connectDb from "@/database/connection";
import Parking from "@/model/parking";
import Booking from "@/model/booking";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getNextAvailableSlot(totalSlots, bookedSlots) {
  for (let i = 1; i <= totalSlots; i++) {
    if (!bookedSlots.includes(i)) return i;
  }
  return null;
}

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
      timeSlot,
    } = await req.json();

    if (!placeName || !userName || !phoneNumber || !vehicleNumber || !vehicleType || !timeSlot) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const parking = await Parking.findOne({ placeName: placeName.trim().toUpperCase() });
    if (!parking) {
      return NextResponse.json({ message: "Venue not found" }, { status: 404 });
    }

    const isCar = vehicleType === "Car";
    const totalSlots = isCar ? parking.totalSlotsOfCar : parking.totalSlotsOfBike;
    const bookedSlots = isCar ? [...parking.bookedSlotsOfCar] : [...parking.bookedSlotsOfBike];

    const slotNumber = getNextAvailableSlot(totalSlots, bookedSlots);
    if (!slotNumber) {
      return NextResponse.json({ message: "No slots available" }, { status: 400 });
    }

    if (isCar) {
      parking.bookedSlotsOfCar.push(slotNumber);
      parking.availableSlotsOfCar = totalSlots - parking.bookedSlotsOfCar.length;
    } else {
      parking.bookedSlotsOfBike.push(slotNumber);
      parking.availableSlotsOfBike = totalSlots - parking.bookedSlotsOfBike.length;
    }

    const booking = await Booking.create({
      userId,
      parkingId: parking._id,
      placeName: parking.placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      timeSlot,
      slotNumber, 
    });

    await parking.save();

    return NextResponse.json(
      {
        message: `Slot P${slotNumber} booked successfully`,
        bookingDetails: {
          placeName: booking.placeName,
          userName: booking.userName,
          phoneNumber: booking.phoneNumber,
          vehicleNumber: booking.vehicleNumber,
          vehicleType: booking.vehicleType,
          timeSlot: booking.timeSlot,
          slotNumber: booking.slotNumber,
        },
        remainingSlots: isCar ? parking.availableSlotsOfCar : parking.availableSlotsOfBike,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Parking POST error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
