/**
 * POST /api/admin/users
 * Admin only: create users with any role (lecturer, admin, student)
 * Requires ADMIN authentication via session
 */

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { email, password, role } = body;

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["STUDENT", "LECTURER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create user
    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    // Create profile if lecturer
    if (role === "LECTURER") {
      await prisma.lecturerProfile.create({
        data: {
          userId: user.id,
          expertise: [],
          isVerified: false,
        },
      });
    }

    // Create profile if student
    if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          name: email.split("@")[0],
          intakeYear: new Date().getFullYear(),
          faculty: "",
          degree: "",
        },
      });
    }

    return NextResponse.json({
      message: `${role} user created successfully`,
      userId: user.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
