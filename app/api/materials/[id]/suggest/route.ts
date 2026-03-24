/**
 * GET /api/materials/[id]/suggest — Return related materials by subject/tags.
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getRelatedMaterials } from "@/lib/services/materials.service";
import { requireAuth } from "@/lib/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const { id } = await params;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;
  const related = await getRelatedMaterials(id, limit);
  return NextResponse.json(related);
}
