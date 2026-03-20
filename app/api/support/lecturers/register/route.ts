/**
 * POST /api/support/lecturers/register — Student registers as lecturer (sets role, creates LecturerProfile).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { lecturerRegisterSchema } from "@/lib/validators/support";
import { requireAuth } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json().catch(() => ({}));
  const parsed = lecturerRegisterSchema.safeParse(body);
  const data = parsed.success ? parsed.data : {};
  const existing = await prisma.lecturerProfile.findUnique({
    where: { userId: user!.id },
  });
  if (existing)
    return NextResponse.json(
      { error: "Already registered as lecturer" },
      { status: 409 }
    );
  await prisma.user.update({
    where: { id: user!.id },
    data: { role: "LECTURER" },
  });
  const lecturer = await prisma.lecturerProfile.create({
    data: {
      userId: user!.id,
      bio: data.bio ?? null,
      expertise: data.expertise ?? [],
    },
  });
  return NextResponse.json(lecturer);
}
