/**
 * Global middleware for protected routes.
 *
 * - Requires any authenticated user (any role) for:
 *   /dashboard/*, /profile/*, /materials/*, /clubs/*, /support/*
 * - Requires ADMIN role for:
 *   /admin/*
 * - Public routes (e.g. landing, auth pages) are allowed through unchanged.
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = req.nextUrl.pathname;

  // Dashboard and profile require any authenticated user
  if (path.startsWith("/dashboard") || path.startsWith("/profile")) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // Admin requires ADMIN role
  if (path.startsWith("/admin")) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // All dashboard-area routes (materials, clubs, support) require auth
  if (path.startsWith("/materials") || path.startsWith("/clubs") || path.startsWith("/support")) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/materials/:path*",
    "/clubs/:path*",
    "/support/:path*",
    "/admin/:path*",
  ],
};
