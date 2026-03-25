import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    requireAuth(user?.role);
    
    // Get user's profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user!.id }
    });
    
    if (!profile) {
      return NextResponse.json({ memberClubs: [], appliedClubs: [] });
    }
    
    // Get clubs the user is a member of
    const memberships = await prisma.studentClub.findMany({
      where: { profileId: profile.id },
      select: { clubId: true }
    });
    
    // Get clubs the user has applied to (PENDING only)
    const applications = await prisma.clubApplication.findMany({
      where: { 
        applicantId: user!.id,
        status: "PENDING"  // Only pending applications
      },
      select: { clubId: true }
    });
    
    const memberClubIds = memberships.map(m => m.clubId);
    const appliedClubIds = applications.map(a => a.clubId);
    
    return NextResponse.json({
      memberClubs: memberClubIds,
      appliedClubs: appliedClubIds
    });
    
  } catch (error) {
    console.error("Error fetching user clubs status:", error);
    return NextResponse.json({ memberClubs: [], appliedClubs: [] }, { status: 500 });
  }
}