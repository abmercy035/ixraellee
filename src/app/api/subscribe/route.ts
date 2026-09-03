import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Subscriber } from "../../../models/Subscriber";
import { sendEmail } from "../../../lib/email";
import { getSubscriptionWelcomeTemplate } from "../../../lib/email-templates";

export async function POST(request: Request) {
  try {
    let email = "";
    let name = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body.email;
      name = body.name;
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      email = formData.get("email") as string;
      name = (formData.get("name") as string) || "";
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (name && !existing.name) {
        existing.name = name.trim();
      }
      if (existing.status === "unsubscribed") {
        existing.status = "active";
        await existing.save();
        return NextResponse.json({ message: "Welcome back! Your subscription has been reactivated." });
      }
      await existing.save();
      return NextResponse.json({ message: "You are already subscribed to Ixraellee Journal." });
    }

    await Subscriber.create({
      email: normalizedEmail,
      name: name?.trim() || "",
      status: "active",
    });

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ixraellee.com";
      const recipientName = name?.trim() || "Reader";
      const emailHtml = getSubscriptionWelcomeTemplate(recipientName, siteUrl);

      await sendEmail({
        to: normalizedEmail,
        name: recipientName,
        subject: "Welcome to Ixraellee Journal 🎉",
        html: emailHtml,
      });
    } catch (e) {
      console.error("[Subscribe Welcome Email Error]:", e);
    }

    return NextResponse.json({ message: "Thank you for subscribing!" }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
