/**
 * GET /api/profile/clubs — List student's club memberships.
 * POST /api/profile/clubs — Add a club membership.
 * DELETE /api/profile/clubs — Remove a club membership (body: { studentClubId }).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { studentClubSchema } from "@/lib/validators/profile";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
    include: { clubs: { include: { club: true } } },
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile.clubs);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = studentClubSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const date =
    typeof parsed.data.joinedDate === "string" && parsed.data.joinedDate.match(/^\d{4}-\d{2}-\d{2}$/)
      ? new Date(parsed.data.joinedDate + "T00:00:00Z")
      : new Date(parsed.data.joinedDate);
  const membership = await prisma.studentClub.create({
    data: {
      profileId: profile.id,
      clubId: parsed.data.clubId,
      role: parsed.data.role ?? "Member",
      joinedDate: date,
    },
    include: { club: true },
  });
  return NextResponse.json(membership);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const studentClubId = body.studentClubId as string | undefined;
  if (!studentClubId) {
    return NextResponse.json({ error: "studentClubId required" }, { status: 400 });
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const membership = await prisma.studentClub.findFirst({
    where: { id: studentClubId, profileId: profile.id },
  });
  if (!membership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  await prisma.studentClub.delete({ where: { id: studentClubId } });
  return NextResponse.json({ ok: true });
}
