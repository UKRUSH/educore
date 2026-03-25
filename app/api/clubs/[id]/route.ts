import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth, requireAdmin } from "@/lib/permissions";
import { clubUpdateSchema } from "@/lib/validators/clubs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const club = await prisma.club.findUnique({
    where: { id: params.id },
    include: { _count: { select: { members: true } } },
  });
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  return NextResponse.json({ ...club, memberCount: club._count.members });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const body = await req.json();
  const parsed = clubUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const club = await prisma.club.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(club);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  await prisma.club.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}