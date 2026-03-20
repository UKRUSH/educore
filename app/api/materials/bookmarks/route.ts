/**
 * GET /api/materials/bookmarks — List current user's bookmarks.
 * POST /api/materials/bookmarks — Add bookmark (body: { materialId }).
 * DELETE /api/materials/bookmarks — Remove bookmark (body: { materialId }).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { bookmarkBodySchema } from "@/lib/validators/materials";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user!.id },
    include: { material: true },
  });
  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = bookmarkBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const existing = await prisma.bookmark.findFirst({
    where: { userId: user!.id, materialId: parsed.data.materialId },
  });
  if (existing)
    return NextResponse.json(existing);
  const bookmark = await prisma.bookmark.create({
    data: { userId: user!.id, materialId: parsed.data.materialId },
    include: { material: true },
  });
  return NextResponse.json(bookmark);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = bookmarkBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  await prisma.bookmark.deleteMany({
    where: { userId: user!.id, materialId: parsed.data.materialId },
  });
  return NextResponse.json({ ok: true });
}
