import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, params } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // ✅ must include http/https

    const successUrl = `${baseUrl}/invoice?${new URLSearchParams(params).toString()}`;
    const cancelUrl = `${baseUrl}/booking`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Parking Spot - ${params.vehicleType}`,
            },
            unit_amount: amount * 100, // amount in paise
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    console.error("Stripe error:", err);
    return new Response(JSON.stringify({ error: "Payment failed" }), { status: 500 });
  }
}
