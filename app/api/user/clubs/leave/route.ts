import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { requireAuth } from "@/lib/permissions";

export async function DELETE(req: NextRequest) {
  try {
    console.log("=== Leave Club API Called ===");
    
    const user = await getCurrentUser(req);
    console.log("User:", user?.id, user?.email);
    
    requireAuth(user?.role);
    
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get("clubId");
    console.log("Club ID from params:", clubId);
    
    if (!clubId) {
      console.log("Error: No club ID provided");
      return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
    }
    
    // Get user's profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user!.id }
    });
    console.log("Profile found:", profile?.id);
    
    if (!profile) {
      console.log("Error: Profile not found for user:", user!.id);
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    // Check if user is a member of the club
    const membership = await prisma.studentClub.findFirst({
      where: {
        profileId: profile.id,
        clubId: clubId
      }
    });
    console.log("Membership found:", membership?.id);
    
    if (!membership) {
      console.log("Error: User is not a member of club:", clubId);
      return NextResponse.json({ error: "You are not a member of this club" }, { status: 400 });
    }
    
    // Remove user from club
    await prisma.studentClub.delete({
      where: { id: membership.id }
    });
    console.log("Membership deleted");
    
    // Delete the approved application instead of updating it
    const application = await prisma.clubApplication.findFirst({
      where: {
        clubId: clubId,
        applicantId: user!.id,
        status: "APPROVED"
      }
    });
    
    if (application) {
      await prisma.clubApplication.delete({
        where: { id: application.id }
      });
      console.log("Application deleted successfully");
    }
    
    // Get updated status
    const updatedMemberships = await prisma.studentClub.findMany({
      where: { profileId: profile.id },
      select: { clubId: true }
    });
    
    const updatedApplications = await prisma.clubApplication.findMany({
      where: { 
        applicantId: user!.id,
        status: "PENDING"
      },
      select: { clubId: true }
    });
    
    console.log("Success: User left club - all records cleaned");
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully left the club",
      userStatus: {
        memberClubs: updatedMemberships.map(m => m.clubId),
        appliedClubs: updatedApplications.map(a => a.clubId)
      }
    });
    
  } catch (error) {
    console.error("Error in leave club API:", error);
    return NextResponse.json({ 
      error: "Failed to leave club: " + (error instanceof Error ? error.message : "Unknown error")
    }, { status: 500 });
  }
}