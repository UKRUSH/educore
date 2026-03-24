/**
 * GET /api/profile/me — Get logged-in student's profile with scores.
 * PUT /api/profile/me — Update profile.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validators/profile";
import { calculateScores } from "@/lib/services/profile.service";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
    include: { semesters: { include: { subjects: true } }, clubs: { include: { club: true } }, sports: true },
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  const scores = await calculateScores(profile.id);
  return NextResponse.json({
    ...profile,
    scores: {
      academic: scores.academic,
      sports: scores.sports,
      society: scores.society,
      overall: scores.overall,
      rawSportPoints: scores.rawSportPoints,
      rawClubPoints: scores.rawClubPoints,
    },
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const updated = await prisma.studentProfile.update({
    where: { id: profile.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}
