/**
 * POST /api/clubs/[id]/apply — Submit club application.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { clubApplySchema } from "@/lib/validators/clubs";
import { requireAuth } from "@/lib/permissions";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { id: clubId } = await ctx.params;
  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club)
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  let reason: string | undefined;
  try {
    const body = await req.json();
    const parsed = clubApplySchema.safeParse(body);
    if (parsed.success) reason = parsed.data.reason;
  } catch {
    // body optional
  }
  const existing = await prisma.clubApplication.findFirst({
    where: { applicantId: user!.id, clubId, status: "PENDING" },
  });
  if (existing)
    return NextResponse.json(
      { error: "You already have a pending application for this club" },
      { status: 409 }
    );
  const application = await prisma.clubApplication.create({
    data: {
      applicantId: user!.id,
      clubId,
      reason: reason ?? null,
    },
    include: { club: true },
  });
  return NextResponse.json(application);
}
