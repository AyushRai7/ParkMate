import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: {
          select: {
            name: true,
            totalCarSlots: true,
            totalBikeSlots: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: booking.id,
      placeName: booking.venue.name,
      userName: booking.userName,
      phoneNumber: booking.phoneNumber,
      vehicleNumber: booking.vehicleNumber,
      vehicleType: booking.vehicleType,
      slotNumber: booking.slotNumber,
      slotLabel: booking.slotNumber ? `P${booking.slotNumber}` : "Not assigned",
      status: booking.status,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch booking", details: error.message },
      { status: 500 }
    );
  }
}
