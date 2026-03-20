/**
 * POST /api/materials/[id]/summarize — Stub: store a text summary for the material.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { summarizeBodySchema } from "@/lib/validators/materials";
import { requireAuth } from "@/lib/permissions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material)
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  const body = await req.json();
  const parsed = summarizeBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const updated = await prisma.material.update({
    where: { id },
    data: { summary: parsed.data.summary },
  });
  return NextResponse.json(updated);
}
