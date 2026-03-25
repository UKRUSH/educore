import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  try {
    console.log("=== Profile Clubs API Called ===");
    
    const user = await getCurrentUser(req);
    console.log("User:", user?.id, user?.email);
    
    requireAuth(user?.role);
    
    // Get user's profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user!.id }
    });
    
    console.log("Profile found:", profile?.id);
    
    if (!profile) {
      console.log("No profile found for user");
      return NextResponse.json([], { status: 200 });
    }
    
    // Get all clubs the user is currently a member of
    const joinedClubs = await prisma.studentClub.findMany({
      where: { profileId: profile.id },
      include: {
        club: true
      },
      orderBy: { joinedDate: "desc" }
    });
    
    console.log(`Found ${joinedClubs.length} joined clubs`);
    
    return NextResponse.json(joinedClubs);
    
  } catch (error) {
    console.error("Error fetching profile clubs:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}