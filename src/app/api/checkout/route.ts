import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getOrCreateUser } from "@/lib/db/users";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { plan } = await req.json(); // "PERSONAL" | "FAMILY"

  const priceId =
    plan === "PERSONAL"
      ? process.env.STRIPE_PERSONAL_PRICE_ID
      : process.env.STRIPE_FAMILY_PRICE_ID;

  if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 503 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    customer_email: user.email,
    metadata: { userId: user.id, plan },
  });

  return NextResponse.json({ url: session.url });
}
