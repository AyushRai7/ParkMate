import connectDb from "@/database/connection";
import Booking from "@/model/booking";
import Parking from "@/model/parking";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ==================== HELPER ====================
function getNextAvailableSpot(totalSlots: number, bookedSlots: number[]): number | null {
  const used = new Set(bookedSlots);
  for (let i = 1; i <= totalSlots; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

// ==================== GET HANDLER ====================
export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const ownerToken = cookieStore.get("ownerToken")?.value;

    // ====== OWNER DASHBOARD ======
    if (ownerToken) {
      const decoded = jwt.verify(ownerToken, process.env.JWT_SECRET_KEY!) as { id: string };

      const venues = await Parking.find({ ownerId: decoded.id }).select("_id");
      const venueIds = venues.map((v) => v._id);

      const bookings = await Booking.find({ parkingId: { $in: venueIds } }).sort({ createdAt: -1 });

      return NextResponse.json({ bookings }, { status: 200 });
    }

    // ====== USER DASHBOARD ======
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (userId) {
      const bookings = await Booking.find({ userId });
      return NextResponse.json({ bookings }, { status: 200 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } catch (err) {
    console.error("GET /booking error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ==================== POST HANDLER ====================
export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const token = (await cookies()).get("userToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
    const userId = decoded.id;

    const { placeName, userName, phoneNumber, vehicleNumber, vehicleType } = await req.json();

    if (!placeName || !userName || !phoneNumber || !vehicleNumber || !vehicleType) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const parking = await Parking.findOne({ placeName: placeName.trim().toUpperCase() });
    if (!parking) return NextResponse.json({ message: "Venue not found" }, { status: 404 });

    const isCar = vehicleType === "Car";
    const totalSlots = isCar ? parking.totalSlotsOfCar : parking.totalSlotsOfBike;
    const bookedSlots = isCar ? parking.bookedSlotsOfCar : parking.bookedSlotsOfBike;

    const slotNumber = getNextAvailableSpot(totalSlots, bookedSlots);
    if (!slotNumber) return NextResponse.json({ message: "No slots available" }, { status: 400 });

    // Add slot to booked slots
    if (isCar) parking.bookedSlotsOfCar.push(slotNumber);
    else parking.bookedSlotsOfBike.push(slotNumber);
    await parking.save();

    const booking = await Booking.create({
      userId,
      parkingId: parking._id,
      placeName: parking.placeName,
      userName,
      phoneNumber,
      vehicleNumber,
      vehicleType,
      slotNumber,
      status: "PENDING",
    });

    return NextResponse.json({ bookingId: booking._id, amount: isCar ? 100 : 50 }, { status: 201 });
  } catch (err) {
    console.error("POST /booking error:", err);
    return NextResponse.json({ message: "Booking failed" }, { status: 500 });
  }
}

// ==================== DELETE HANDLER ====================
export async function DELETE(req: NextRequest) {
  await connectDb();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingId = new URL(req.url).searchParams.get("bookingId");
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

    const parking = await Parking.findById(booking.parkingId).session(session);
    if (parking) {
      if (booking.vehicleType === "Car") {
        parking.bookedSlotsOfCar = parking.bookedSlotsOfCar.filter((s: number) => s !== booking.slotNumber);
      } else {
        parking.bookedSlotsOfBike = parking.bookedSlotsOfBike.filter((s: number) => s !== booking.slotNumber);
      }
      await parking.save({ session });
    }

    await booking.deleteOne({ session });
    await session.commitTransaction();

    return NextResponse.json({ message: "Booking cancelled successfully" }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    console.error("DELETE /booking error:", err);
    return NextResponse.json({ message: "Cancel failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
