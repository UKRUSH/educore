/**
 * GET /api/profile/suggestions — Rule-based suggestions (weak subjects, GPA drop, club, resource, session).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getSuggestions } from "@/lib/services/profile.service";
import { requireAuth } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user!.id },
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const suggestions = await getSuggestions(profile.id);
  return NextResponse.json(suggestions);
}
