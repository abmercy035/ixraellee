import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Subscriber } from "../../../models/Subscriber";
import { sendEmail } from "../../../lib/email";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.status === "unsubscribed") {
        existing.status = "active";
        await existing.save();
        return NextResponse.json({ message: "Welcome back! Your subscription has been reactivated." });
      }
      return NextResponse.json({ message: "You are already subscribed to Ixraellee Journal." });
    }

    await Subscriber.create({
      email: email.toLowerCase().trim(),
      name: name || "",
      status: "active",
    });

    await sendEmail({
      to: email,
      subject: "Welcome to Ixraellee Journal",
      html: `<h1>Welcome to Ixraellee Journal</h1><p>Thank you for subscribing to new stories, field notes, and ideas.</p>`,
    });

    return NextResponse.json({ message: "Thank you for subscribing!" }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
