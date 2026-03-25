import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth, requireAdmin } from "@/lib/permissions";
import { applicationStatusSchema } from "@/lib/validators/clubs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  requireAdmin(user?.role);
  const applications = await prisma.clubApplication.findMany({
    include: {
      applicant: { select: { id: true, email: true } },
      club: { select: { id: true, name: true, category: true } },
    },
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
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { applicationId, status, feedback } = parsed.data;
  
  // Get the application first
  const application = await prisma.clubApplication.findUnique({
    where: { id: applicationId },
    include: { 
      club: true,
      applicant: {
        include: {
          profile: true
        }
      }
    },
  });
  
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  // Check capacity if approving
  if (status === "APPROVED") {
    const memberCount = await prisma.studentClub.count({
      where: { clubId: application.clubId }
    });
    
    if (memberCount >= application.club.capacity) {
      return NextResponse.json({ error: "Club is full" }, { status: 400 });
    }
    
    // Check if user is already a member
    const existingMember = await prisma.studentClub.findFirst({
      where: {
        profileId: application.applicant.profile!.id,
        clubId: application.clubId
      }
    });
    
    if (!existingMember) {
      // Add to StudentClub table
      await prisma.studentClub.create({
        data: {
          profileId: application.applicant.profile!.id,
          clubId: application.clubId,
          role: "Member",
          joinedDate: new Date(),
          points: 0
        }
      });
    }
  }
  
  // Update application status
  const updated = await prisma.clubApplication.update({
    where: { id: applicationId },
    data: { 
      status, 
      feedback: feedback ?? null, 
      updatedAt: new Date() 
    },
  });
  
  return NextResponse.json(updated);
}