// Server-side auth: get current session for API routes

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getCurrentUser(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token
    ? { id: token.id as string, email: token.email as string, role: token.role }
    : null;
}
