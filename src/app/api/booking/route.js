import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import Parking from "@/model/parking";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

function getNextAvailableSpot(totalSlots, bookedSlots) {
  const used = new Set(bookedSlots);
  for (let i = 1; i <= totalSlots; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

export async function GET(req) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const venueNames = url.searchParams.getAll("venueNames[]");

    let bookings = [];

    if (userId) {
      bookings = await Booking.find({ userId });
    } else if (venueNames.length > 0) {
      bookings = await Booking.find({ placeName: { $in: venueNames } });
    } else {
      return Response.json(
        { message: "Missing query parameters" },
        { status: 400 }
      );
    }

    return Response.json({ bookings }, { status: 200 });
  } catch (err) {
    console.error("GET /booking error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDb();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const token = cookies().get("userToken")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
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

    const parking = await Parking.findOne({ placeName }).session(session);
    if (!parking) {
      return Response.json({ message: "Venue not found" }, { status: 404 });
    }

    const isCar = vehicleType === "Car";

    const totalSlots = isCar
      ? parking.totalSlotsOfCar
      : parking.totalSlotsOfBike;

    const bookedSlots = isCar
      ? [...parking.bookedSlotsOfCar]
      : [...parking.bookedSlotsOfBike];

    const spotNumber = getNextAvailableSpot(totalSlots, bookedSlots);

    if (!spotNumber) {
      return Response.json(
        { message: "No slots available" },
        { status: 400 }
      );
    }

    if (isCar) {
      parking.bookedSlotsOfCar.push(spotNumber);
    } else {
      parking.bookedSlotsOfBike.push(spotNumber);
    }

    await parking.save({ session });

    await Booking.create(
      [
        {
          userId,
          parkingId: parking._id,
          placeName,
          userName,
          phoneNumber,
          vehicleNumber,
          vehicleType,
          timeSlot,
          slotNumber: spotNumber, 
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return Response.json(
      {
        message: "Booking successful",
        slotNumber: spotNumber,
        remainingSlots: totalSlots - bookedSlots.length - 1,
      },
      { status: 201 }
    );
  } catch (err) {
    await session.abortTransaction();
    console.error("POST /booking error:", err);
    return Response.json({ message: "Booking failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}

export async function DELETE(req) {
  await connectDb();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingId = new URL(req.url).searchParams.get("bookingId");

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return Response.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    const parking = await Parking.findById(booking.parkingId).session(session);

    if (parking) {
      if (booking.vehicleType === "Car") {
        parking.bookedSlotsOfCar = parking.bookedSlotsOfCar.filter(
          (s) => s !== booking.slotNumber
        );
      } else {
        parking.bookedSlotsOfBike = parking.bookedSlotsOfBike.filter(
          (s) => s !== booking.slotNumber
        );
      }

      await parking.save({ session });
    }

    await booking.deleteOne({ session });
    await session.commitTransaction();

    return Response.json(
      { message: "Booking cancelled successfully" },
      { status: 200 }
    );
  } catch (err) {
    await session.abortTransaction();
    console.error("DELETE /booking error:", err);
    return Response.json({ message: "Cancel failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
