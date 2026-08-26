import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Subscriber } from "../../../../models/Subscriber";
import { sendEmail } from "../../../../lib/email";

export async function POST(request: Request) {
  try {
    const { subject, html } = await request.json();

    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML body are required." }, { status: 400 });
    }

    await connectDB();

    const activeSubscribers = await Subscriber.find({ status: "active" }).select("email").lean();
    if (activeSubscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers found." });
    }

    let sentCount = 0;
    for (const subscriber of activeSubscribers) {
      const res = await sendEmail({
        to: subscriber.email,
        subject,
        html,
      });
      if (res.success) sentCount++;
    }

    return NextResponse.json({
      message: `Broadcast initiated successfully. Dispatched to ${sentCount} of ${activeSubscribers.length} subscribers.`,
      recipientCount: activeSubscribers.length,
      sentCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
