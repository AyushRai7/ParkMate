import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType } from "@prisma/client";

export const runtime = "nodejs";

function getNextAvailableSlot(
  totalSlots: number,
  bookedSlots: number[]
): number | null {
  const used = new Set(bookedSlots);
  for (let i = 1; i <= totalSlots; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return NextResponse.json(
          { error: "Missing bookingId" },
          { status: 400 }
        );
      }

      await confirmBookingAndAssignSlot(bookingId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 400 }
    );
  }
}

async function confirmBookingAndAssignSlot(bookingId: string) {
  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { venue: true },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      return;
    }

    const venue = booking.venue;

    const totalSlots =
      booking.vehicleType === VehicleType.CAR
        ? venue.totalCarSlots
        : venue.totalBikeSlots;

    const confirmedBookings = await tx.booking.findMany({
      where: {
        venueId: venue.id,
        vehicleType: booking.vehicleType,
        status: BookingStatus.CONFIRMED,
      },
      select: { slotNumber: true },
    });

    const bookedSlots = confirmedBookings
      .map((b) => b.slotNumber)
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
      },
    });
  });
}
