import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth APIs without credentials
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth/")) {
    return NextResponse.next();
  }

  const adminToken = request.cookies.get("admin_token")?.value;

  // If visiting admin web pages without valid token, redirect to /admin/login
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If calling admin API endpoints without token, return 401
  if (pathname.startsWith("/api/admin")) {
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access. Please login." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
