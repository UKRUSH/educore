/**
 * GET /api/health — Health check (e.g. for load balancers).
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
