import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Subscriber } from "../../../../models/Subscriber";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    await connectDB();

    const filter: Record<string, unknown> = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (query) {
      filter.$or = [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ];
    }

    const [subscribers, total, activeCount, unsubscribedCount] = await Promise.all([
      Subscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(filter),
      Subscriber.countDocuments({ status: "active" }),
      Subscriber.countDocuments({ status: "unsubscribed" }),
    ]);

    return NextResponse.json({
      subscribers,
      total,
      activeCount,
      unsubscribedCount,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, status } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: normalizedEmail });

    if (existing) {
      existing.name = name || existing.name;
      existing.status = status || "active";
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    }

    const newSub = await Subscriber.create({
      email: normalizedEmail,
      name: name?.trim() || "",
      status: status || "active",
    });

    return NextResponse.json(newSub, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
