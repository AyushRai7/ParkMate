import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { amount, bookingId, vehicleType } = await req.json();
    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: "Missing bookingId or amount" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 

    const successUrl = `${baseUrl}/invoice?bookingId=${bookingId}`;
    const cancelUrl = `${baseUrl}/booking`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Parking Spot - ${vehicleType}`,
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
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
