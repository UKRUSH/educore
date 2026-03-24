/**
 * GET /api/support/lecturers — List verified lecturers.
 */
import { NextResponse } from "next/server";
import { getVerifiedLecturers } from "@/lib/services/support.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const lecturers = await getVerifiedLecturers();
  return NextResponse.json(lecturers);
}
