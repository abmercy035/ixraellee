import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Subscriber } from "../../../../models/Subscriber";
import { sendBroadcast } from "../../../../lib/email";

export async function POST(request: Request) {
  try {
    const { subject, html } = await request.json();

    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML body are required." }, { status: 400 });
    }

    await connectDB();

    const activeSubscribers = await Subscriber.find({ status: "active" }).select("email name").lean();
    if (activeSubscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers found." });
    }

    const recipients = activeSubscribers.map((s) => ({
      name: s.name || "Subscriber",
      address: s.email,
    }));

    const result = await sendBroadcast({
      subject,
      html,
      recipients,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Broadcast failed" }, { status: 500 });
    }

    return NextResponse.json({
      message: `Broadcast initiated successfully. Dispatched to ${result.sentCount} of ${activeSubscribers.length} subscribers.`,
      recipientCount: activeSubscribers.length,
      sentCount: result.sentCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
