/**
 * GET /api/clubs/[id] — Club details with member count.
 * PUT /api/clubs/[id] — Update club (admin only).
 * DELETE /api/clubs/[id] — Delete club (admin only).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { clubUpdateSchema } from "@/lib/validators/clubs";
import { requireAuth, requireAdmin } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const club = await prisma.club.findUnique({
    where: { id },
    include: { _count: { select: { members: true } } },
  });
  if (!club)
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  return NextResponse.json({
    ...club,
    memberCount: club._count.members,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const { id } = await params;
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club)
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  const body = await req.json();
  const parsed = clubUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await prisma.club.update({
    where: { id },
    data: {
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.category && { category: parsed.data.category }),
      ...(parsed.data.capacity && { capacity: parsed.data.capacity }),
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
  requireAdmin(user?.role);
  const { id } = await params;
  await prisma.club.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
