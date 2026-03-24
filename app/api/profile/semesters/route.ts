/**
 * GET /api/profile/semesters — List semesters for logged-in student.
 * POST /api/profile/semesters — Add a semester (with optional subjects).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { semesterSchema } from "@/lib/validators/profile";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
    include: { semesters: { include: { subjects: true } } },
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile.semesters);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = semesterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const profile = await prisma.studentProfile.findUnique({ where: { userId: user!.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const semester = await prisma.semester.create({
    data: {
      profileId: profile.id,
      semesterNo: parsed.data.semesterNo,
      gpa: parsed.data.gpa,
      subjects: parsed.data.subjects
        ? {
            create: parsed.data.subjects.map((s) => ({
              code: s.code,
              name: s.name,
              credits: s.credits,
              mark: s.mark,
              grade: s.grade,
            })),
          }
        : undefined,
    },
    include: { subjects: true },
  });
  return NextResponse.json(semester);
}
