import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  
  // Check if user has applied to this club
  const application = await prisma.clubApplication.findFirst({
    where: {
      clubId: params.id,
      applicantId: user!.id
    }
  });
  
  // Check if user is already a member
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id }
  });
  
  let isMember = false;
  if (profile) {
    const membership = await prisma.studentClub.findFirst({
      where: {
        profileId: profile.id,
        clubId: params.id
      }
    });
    isMember = !!membership;
  }
  
  return NextResponse.json({
    hasApplied: !!application,
    isMember: isMember,
    applicationStatus: application?.status
  });
}