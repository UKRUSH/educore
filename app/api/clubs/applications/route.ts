/**
 * GET /api/clubs/applications — Admin: list club applications (optional status filter).
 * PUT /api/clubs/applications — Admin: approve or reject an application (body: applicationId, status, feedback?).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { applicationStatusSchema } from "@/lib/validators/clubs";
import { requireAuth, requireAdmin } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const status = req.nextUrl.searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null;
  const where = status ? { status } : {};
  const applications = await prisma.clubApplication.findMany({
    where,
    include: { club: true },
    orderBy: { appliedAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const body = await req.json();
  const parsed = applicationStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const app = await prisma.clubApplication.findUnique({
    where: { id: parsed.data.applicationId },
  });
  if (!app)
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const updated = await prisma.clubApplication.update({
    where: { id: parsed.data.applicationId },
    data: {
      status: parsed.data.status,
      feedback: parsed.data.feedback ?? (parsed.data.status === "REJECTED" ? parsed.data.feedback : null),
    },
    include: { club: true },
  });
  return NextResponse.json(updated);
}
