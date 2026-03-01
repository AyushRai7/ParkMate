import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType } from "@prisma/client";

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook signature failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("[Webhook] No bookingId in session metadata");
      return NextResponse.json({ received: true, warning: "No bookingId" });
    }

    try {
      await confirmBookingAndAssignSlot(bookingId);
    } catch (err: any) {
      console.error(`[Webhook] Failed to confirm booking ${bookingId}:`, err.message);
      return NextResponse.json(
        { error: "Slot assignment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function confirmBookingAndAssignSlot(bookingId: string): Promise<void> {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { venue: true },
        });

        if (!booking) throw new Error(`Booking ${bookingId} not found`);
        if (booking.status === BookingStatus.CONFIRMED) return;
        if (
          booking.status === BookingStatus.CANCELLED ||
          booking.status === BookingStatus.EXPIRED
        ) {
          throw new Error(`Booking is ${booking.status}, cannot confirm`);
        }

        const totalSlots =
          booking.vehicleType === VehicleType.CAR
            ? booking.venue.totalCarSlots
            : booking.venue.totalBikeSlots;

        const confirmedBookings = await tx.booking.findMany({
          where: {
            venueId: booking.venueId,
            vehicleType: booking.vehicleType,
            status: BookingStatus.CONFIRMED,
            id: { not: bookingId },
          },
          select: { slotNumber: true },
        });

        const bookedSlots = confirmedBookings
          .map((b) => b.slotNumber)
          .filter((s): s is number => s !== null);

        const nextSlot = getNextAvailableSlot(totalSlots, bookedSlots);
        if (!nextSlot) throw new Error("No slots available");

        await tx.booking.update({
          where: { id: bookingId },
          data: { slotNumber: nextSlot, status: BookingStatus.CONFIRMED },
        });
      });

      return; 

    } catch (err: any) {
      const isConflict =
        err.code === "P2002" || 
        err.message?.includes("Unique constraint");

      if (isConflict && attempt < MAX_RETRIES) {
        console.warn(`[Webhook] Slot conflict on attempt ${attempt}, retrying...`);
        continue;
      }

      throw err; 
    }
  }
}