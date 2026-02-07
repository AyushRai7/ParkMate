import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, bookingId } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "Missing bookingId or amount" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Invalid booking" },
        { status: 404 }
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { error: "Booking already paid or expired" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL!;
    const successUrl = `${baseUrl}/invoice?bookingId=${bookingId}`;
    const cancelUrl = `${baseUrl}/booking`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
        vehicleType: booking.vehicleType,
      },

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name:
                booking.vehicleType === VehicleType.CAR
                  ? "Car Parking Spot"
                  : "Bike Parking Spot",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}
