/**
 * POST /api/support/sessions/[id]/apply — Student applies for a session.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/permissions";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(_req);
  requireAuth(user?.role);
  const { id: sessionId } = await params;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  const existing = await prisma.sessionApplication.findFirst({
    where: { sessionId, studentId: user!.id },
  });
  if (existing)
    return NextResponse.json(
      { error: "You already applied for this session" },
      { status: 409 }
    );
  const application = await prisma.sessionApplication.create({
    data: { sessionId, studentId: user!.id },
    include: { session: true },
  });
  return NextResponse.json(application);
}
