/**
 * GET /api/clubs — List all clubs (with member count).
 * POST /api/clubs — Create club (admin only).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { clubCreateSchema } from "@/lib/validators/clubs";
import { requireAuth, requireAdmin } from "@/lib/permissions";

export async function GET() {
  const clubs = await prisma.club.findMany({
    include: { _count: { select: { members: true } } },
  });
  return NextResponse.json(
    clubs.map((c) => ({
      ...c,
      memberCount: c._count.members,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const body = await req.json();
  const parsed = clubCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const club = await prisma.club.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      capacity: parsed.data.capacity ?? 30,
    },
  });
  return NextResponse.json(club);
}
