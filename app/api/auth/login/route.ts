/**
 * POST /api/auth/login
 * Use NextAuth signIn from the client (e.g. signIn("credentials", { email, password }))
 * which sets the JWT cookie. This route returns 405; the actual login is via NextAuth.
 */
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Use signIn() from next-auth/react with credentials provider" },
    { status: 405 }
  );
}
