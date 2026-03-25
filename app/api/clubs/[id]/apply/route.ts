import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth } from "@/lib/permissions";
import { clubApplySchema } from "@/lib/validators/clubs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  
  const club = await prisma.club.findUnique({
    where: { id: params.id },
    include: { _count: { select: { members: true } } },
  });
  
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  if (club._count.members >= club.capacity) return NextResponse.json({ error: "Club is full" }, { status: 400 });
  
  // Check if user has ANY existing application (including approved or rejected)
  const existing = await prisma.clubApplication.findFirst({
    where: { 
      clubId: params.id, 
      applicantId: user!.id 
    }
  });
  
  if (existing) {
    return NextResponse.json({ 
      error: "You have already applied to this club. Check your application status." 
    }, { status: 400 });
  }
  
  const body = await req.json();
  const parsed = clubApplySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  
  const application = await prisma.clubApplication.create({
    data: { 
      clubId: params.id, 
      applicantId: user!.id, 
      reason: parsed.data.reason ?? null, 
      status: "PENDING" 
    },
  });
  
  return NextResponse.json(application, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  
  const applications = await prisma.clubApplication.findMany({
    where: { clubId: params.id },
    include: { applicant: { select: { id: true, email: true } } },
    orderBy: { appliedAt: "desc" },
  });
  
  return NextResponse.json(applications);
}