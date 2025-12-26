import connectDb from "@/database/connection.js";
import Booking from "@/model/booking.js";
import Parking from "@/model/parking.js";
import { NextResponse } from "next/server";

function getNextAvailableSlot(totalSlots, bookedSlots) {
  for (let i = 1; i <= totalSlots; i++) {
    if (!bookedSlots.includes(i)) return i;
  }
  return null;
}

export async function POST(req) {
  await connectDb();
  const { bookingId } = await req.json();

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status === "CONFIRMED") {
    return NextResponse.json({ success: true });
  }

  const parking = await Parking.findById(booking.parkingId);
  const isCar = booking.vehicleType === "Car";

  const totalSlots = isCar
    ? parking.totalSlotsOfCar
    : parking.totalSlotsOfBike;

  const bookedSlots = isCar
    ? parking.bookedSlotsOfCar
    : parking.bookedSlotsOfBike;

  const slotNumber = getNextAvailableSlot(totalSlots, bookedSlots);

  if (!slotNumber) {
    return NextResponse.json(
      { message: "No slots available" },
      { status: 400 }
    );
  }

  if (isCar) {
    parking.bookedSlotsOfCar.push(slotNumber);
    parking.availableSlotsOfCar = totalSlots - parking.bookedSlotsOfCar.length;
  } else {
    parking.bookedSlotsOfBike.push(slotNumber);
    parking.availableSlotsOfBike =
      totalSlots - parking.bookedSlotsOfBike.length;
  }

  booking.slotNumber = slotNumber;
  booking.status = "CONFIRMED";

  await parking.save();
  await booking.save();
  if (booking.status === "CONFIRMED" && booking.slotNumber) {
  return NextResponse.json({ success: true });
}
}

