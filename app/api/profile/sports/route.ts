/**
 * GET /api/profile/sports — List sport achievements.
 * POST /api/profile/sports — Add sport achievement.
 * DELETE /api/profile/sports — Remove one (body: { sportId }).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { sportAchievementSchema } from "@/lib/validators/profile";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
    include: { sports: true },
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile.sports);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = sportAchievementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const date =
    typeof parsed.data.date === "string" && parsed.data.date.match(/^\d{4}-\d{2}-\d{2}$/)
      ? new Date(parsed.data.date + "T00:00:00Z")
      : new Date(parsed.data.date);
  const sport = await prisma.sportAchievement.create({
    data: {
      profileId: profile.id,
      sportName: parsed.data.sportName,
      type: parsed.data.type,
      place: parsed.data.place ?? null,
      date,
      points: parsed.data.points ?? 10,
      fileUrl: parsed.data.fileUrl ?? null,
    },
  });
  return NextResponse.json(sport);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const sportId = body.sportId as string | undefined;
  if (!sportId) return NextResponse.json({ error: "sportId required" }, { status: 400 });
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const sport = await prisma.sportAchievement.findFirst({
    where: { id: sportId, profileId: profile.id },
  });
  if (!sport) return NextResponse.json({ error: "Sport achievement not found" }, { status: 404 });
  await prisma.sportAchievement.delete({ where: { id: sportId } });
  return NextResponse.json({ ok: true });
}
