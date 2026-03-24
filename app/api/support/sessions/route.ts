/**
 * GET /api/support/sessions — List sessions.
 * POST /api/support/sessions — Lecturer creates a session.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { sessionCreateSchema } from "@/lib/validators/support";
import { requireAuth, requireLecturer } from "@/lib/permissions";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: { lecturer: { include: { user: { select: { email: true } } } } },
    orderBy: { scheduledAt: "asc" },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireLecturer(user?.role);
  const lecturer = await prisma.lecturerProfile.findUnique({
    where: { userId: user!.id },
  });
  if (!lecturer)
    return NextResponse.json(
      { error: "Lecturer profile not found. Register as lecturer first." },
      { status: 403 }
    );
  const body = await req.json();
  const parsed = sessionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const session = await prisma.session.create({
    data: {
      lecturerId: lecturer.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      scheduledAt: new Date(parsed.data.scheduledAt),
      capacity: parsed.data.capacity ?? 10,
      meetLink: parsed.data.meetLink ?? null,
    },
  });
  return NextResponse.json(session);
}
