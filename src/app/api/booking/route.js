import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import Parking from "@/model/parking";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

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
      bookings = await Booking.find({
        placeName: { $in: venueNames },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Missing query parameters" }),
        {
          status: 400,
        }
      );
    }

    if (!bookings.length) {
      return new Response(JSON.stringify({ message: "No bookings found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ bookings }), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/booking:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
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

    const parking = await Parking.findOne({ placeName });
    if (!parking) {
      return new Response(JSON.stringify({ message: "Venue not found" }), {
        status: 404,
      });
    }

    if (
      (vehicleType === "Car" && parking.availableSlotsOfCar < 1) ||
      (vehicleType === "Bike" && parking.availableSlotsOfBike < 1)
    ) {
      return new Response(
        JSON.stringify({ message: `No available ${vehicleType} spots` }),
        { status: 400 }
      );
    }

    // Update available slots
    if (vehicleType === "Car") {
      parking.availableSlotsOfCar -= 1;
    } else {
      parking.availableSlotsOfBike -= 1;
    }

    await parking.save();

    const totalSlots =
      vehicleType === "Car"
        ? parking.totalSlotsOfCar
        : parking.totalSlotsOfBike;
    const availableSlots =
      vehicleType === "Car"
        ? parking.availableSlotsOfCar
        : parking.availableSlotsOfBike;

    const spotsBooked = totalSlots - availableSlots;

    const newBooking = new Booking({
      userId,
      placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      timeSlot,
      parkingId: parking._id,
      spotsBooked,
    });

    await newBooking.save();

    return new Response(
      JSON.stringify({
        message: "Spot booked successfully",
        remainingSlots:
          vehicleType === "Car"
            ? parking.availableSlotsOfCar
            : parking.availableSlotsOfBike,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST booking:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return new Response(
        JSON.stringify({ message: "Valid booking ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new Response(JSON.stringify({ message: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parking = await Parking.findById(booking.parkingId);
    if (parking) {
      if (booking.vehicleType === "Car") {
        parking.availableCarSlots += booking.spotsBooked;
      } else if (booking.vehicleType === "Bike") {
        parking.availableBikeSlots += booking.spotsBooked;
      }
      await parking.save();
    }

    await booking.deleteOne();

    return new Response(
      JSON.stringify({ message: "Booking cancelled successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in DELETE /api/booking:", error.message);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
