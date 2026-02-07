import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType } from "@prisma/client";

function getNextAvailableSlot(totalSlots: number, bookedSlots: number[]): number | null {
  const used = new Set(bookedSlots);
  
  for (let i = 1; i <= totalSlots; i++) {
    if (!used.has(i)) {
      return i;
    }
  }
  
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          venue: true
        }
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.status === BookingStatus.CONFIRMED) {
        return {
          success: true,
          alreadyConfirmed: true,
          slotNumber: booking.slotNumber,
          slotLabel: `P${booking.slotNumber}`,
          venueName: booking.venue.name
        };
      }

      const venue = booking.venue;

      const totalSlots = booking.vehicleType === VehicleType.CAR
        ? venue.totalCarSlots
        : venue.totalBikeSlots;

      const confirmedBookings = await tx.booking.findMany({
        where: {
          venueId: venue.id,
          vehicleType: booking.vehicleType,
          status: BookingStatus.CONFIRMED,
        },
        select: { slotNumber: true }
      });

      const bookedSlots = confirmedBookings
        .map(b => b.slotNumber)
        .filter((s): s is number => s !== null);
      const nextSlot = getNextAvailableSlot(totalSlots, bookedSlots);

      if (!nextSlot) {
        throw new Error("No slots available");
      }

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          slotNumber: nextSlot,
          status: BookingStatus.CONFIRMED,
        }
      });

      return {
        success: true,
        slotNumber: nextSlot,
        slotLabel: `P${nextSlot}`,
        venueName: venue.name,
        vehicleType: booking.vehicleType
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Confirmation error:", error);
    return NextResponse.json(
      { error: "Slot assignment failed", details: error.message },
      { status: 500 }
    );
  }
}