import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";
import { comparePassword, hashPassword, signAdminToken } from "../../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username/Email and password are required." }, { status: 400 });
    }

    await connectDB();

    const inputUser = username.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envAdminUser = (process.env.ADMIN_USERNAME || "").trim().toLowerCase();
    const envAdminPass = process.env.ADMIN_PASSWORD || "";

    // Check if input matches .env master admin credentials
    const matchesEnvIdentifier =
      inputUser === envAdminUser ||
      inputUser === envAdminEmail ||
      inputUser === "admin" ||
      (envAdminEmail && inputUser === envAdminEmail.split("@")[0]);

    if (matchesEnvIdentifier && password === envAdminPass) {
      // Sync or create the admin user in DB
      const passwordHash = await hashPassword(envAdminPass);
      let adminUser = await User.findOne({
        $or: [
          { username: envAdminUser },
          { username: "admin" },
          ...(envAdminEmail ? [{ username: envAdminEmail }] : []),
        ],
      });

      if (!adminUser) {
        adminUser = await User.create({
          username: envAdminEmail || envAdminUser || "admin",
          passwordHash,
          role: "admin",
        });
      } else {
        adminUser.passwordHash = passwordHash;
        await adminUser.save();
      }

      const token = signAdminToken({
        username: adminUser.username,
        role: adminUser.role,
      });

      const response = NextResponse.json({
        ok: true,
        user: { username: adminUser.username, role: adminUser.role },
      });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Otherwise check database User collection with bcrypt
    const user = await User.findOne({
      $or: [{ username: inputUser }],
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = signAdminToken({
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: { username: user.username, role: user.role },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
