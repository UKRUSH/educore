/**
 * PUT /api/profile/semesters/[id] — Edit semester and its subjects.
 * DELETE /api/profile/semesters/[id] — Delete semester and its subjects.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { semesterSchema } from "@/lib/validators/profile";
import { requireAuth } from "@/lib/permissions";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { id } = await params;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const semester = await prisma.semester.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!semester) return NextResponse.json({ error: "Semester not found" }, { status: 404 });
  const body = await req.json();
  const parsed = semesterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  await prisma.subjectResult.deleteMany({ where: { semesterId: id } });
  const updated = await prisma.semester.update({
    where: { id },
    data: {
      semesterNo: parsed.data.semesterNo,
      gpa: parsed.data.gpa,
      subjects: parsed.data.subjects
        ? { create: parsed.data.subjects.map((s) => ({ ...s })) }
        : undefined,
    },
    include: { subjects: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(_req);
  requireAuth(user?.role);
  const { id } = await params;
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const semester = await prisma.semester.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!semester) return NextResponse.json({ error: "Semester not found" }, { status: 404 });
  await prisma.semester.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
