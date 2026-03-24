/**
 * GET /api/materials — List all materials (with optional pagination).
 * POST /api/materials — Upload new material (title, fileUrl, fileType, etc.).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { materialCreateSchema } from "@/lib/validators/materials";
import { parsePagination, paginated } from "@/lib/utils/pagination";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  const { page, limit, skip } = parsePagination(query);
  const [data, total] = await Promise.all([
    prisma.material.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.material.count(),
  ]);
  return NextResponse.json(paginated(data, total, page, limit));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = materialCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const material = await prisma.material.create({
    data: {
      uploaderId: user!.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      fileUrl: parsed.data.fileUrl,
      fileType: parsed.data.fileType,
      subject: parsed.data.subject ?? null,
      tags: parsed.data.tags ?? [],
    },
  });
  return NextResponse.json(material);
}
