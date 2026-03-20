/**
 * GET /api/support/sessions/[id] — Session detail.
 * PUT /api/support/sessions/[id] — Lecturer updates session.
 * DELETE /api/support/sessions/[id] — Lecturer deletes session.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { sessionUpdateSchema } from "@/lib/validators/support";
import { requireAuth, requireLecturer } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { lecturer: { include: { user: { select: { email: true } } } } },
  });
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  return NextResponse.json(session);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireLecturer(user?.role);
  const { id } = await params;
  const lecturer = await prisma.lecturerProfile.findUnique({
    where: { userId: user!.id },
  });
  if (!lecturer)
    return NextResponse.json({ error: "Lecturer profile not found" }, { status: 403 });
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.lecturerId !== lecturer.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = sessionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await prisma.session.update({
    where: { id },
    data: {
      ...(parsed.data.title && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.scheduledAt && { scheduledAt: new Date(parsed.data.scheduledAt) }),
      ...(parsed.data.capacity && { capacity: parsed.data.capacity }),
      ...(parsed.data.meetLink !== undefined && { meetLink: parsed.data.meetLink }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(_req);
  requireAuth(user?.role);
  requireLecturer(user?.role);
  const { id } = await params;
  const lecturer = await prisma.lecturerProfile.findUnique({
    where: { userId: user!.id },
  });
  if (!lecturer)
    return NextResponse.json({ error: "Lecturer profile not found" }, { status: 403 });
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.lecturerId !== lecturer.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
