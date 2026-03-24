/**
 * POST /api/profile/subjects — Add a subject result to a semester.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { subjectSchema } from "@/lib/validators/profile";
import { requireAuth } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = subjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
  });
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const semester = await prisma.semester.findFirst({
    where: { id: parsed.data.semesterId, profileId: profile.id },
  });
  if (!semester)
    return NextResponse.json({ error: "Semester not found" }, { status: 404 });
  const subject = await prisma.subjectResult.create({
    data: {
      semesterId: parsed.data.semesterId,
      code: parsed.data.code,
      name: parsed.data.name,
      credits: parsed.data.credits,
      mark: parsed.data.mark,
      grade: parsed.data.grade,
    },
  });
  return NextResponse.json(subject);
}
