/**
 * GET /api/materials/[id] — Single material.
 * PUT /api/materials/[id] — Update material (owner or admin).
 * DELETE /api/materials/[id] — Delete material (owner or admin).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { materialUpdateSchema } from "@/lib/validators/materials";
import { requireAuth, isAdmin } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const material = await prisma.material.findUnique({
    where: { id },
  });
  if (!material)
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  return NextResponse.json(material);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material)
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  if (material.uploaderId !== user!.id && !isAdmin(user!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = materialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await prisma.material.update({
    where: { id },
    data: {
      ...(parsed.data.title && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.fileUrl && { fileUrl: parsed.data.fileUrl }),
      ...(parsed.data.fileType && { fileType: parsed.data.fileType }),
      ...(parsed.data.subject !== undefined && { subject: parsed.data.subject }),
      ...(parsed.data.tags && { tags: parsed.data.tags }),
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
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material)
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  if (material.uploaderId !== user!.id && !isAdmin(user!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.material.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
