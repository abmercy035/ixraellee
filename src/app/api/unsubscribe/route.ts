import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Subscriber } from "../../../models/Subscriber";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const subscriber = await Subscriber.findOne({ email: normalizedEmail }).lean();

    if (!subscriber) {
      return NextResponse.json({ found: false, email: normalizedEmail, status: "none" });
    }

    return NextResponse.json({
      found: true,
      email: subscriber.email,
      name: subscriber.name,
      status: subscriber.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, action } = body; // action can be "unsubscribe" or "resubscribe"

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const targetStatus = action === "resubscribe" ? "active" : "unsubscribed";

    const subscriber = await Subscriber.findOneAndUpdate(
      { email: normalizedEmail },
      { status: targetStatus },
      { new: true }
    );

    if (!subscriber) {
      // If subscriber doesn't exist yet and action is unsubscribe, we can record it
      if (targetStatus === "unsubscribed") {
        await Subscriber.create({
          email: normalizedEmail,
          status: "unsubscribed",
        });
      }
    }

    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      status: targetStatus,
      message:
        targetStatus === "unsubscribed"
          ? "You have been unsubscribed successfully."
          : "Welcome back! Your subscription is active.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
