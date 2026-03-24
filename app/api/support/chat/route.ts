/**
 * POST /api/support/chat — Create a community post (simple chat/post).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { communityPostSchema } from "@/lib/validators/support";
import { requireAuth } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  requireAuth(user?.role);
  const body = await req.json();
  const parsed = communityPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const post = await prisma.communityPost.create({
    data: {
      authorId: user!.id,
      content: parsed.data.content,
      tags: parsed.data.tags ?? [],
    },
  });
  return NextResponse.json(post);
}
