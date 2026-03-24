/**
 * POST /api/auth/register
 * Hash password with bcrypt, create User, return success (client can then sign in via NextAuth).
 */
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerBodySchema } from "@/lib/validators/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, password, name } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    // Only students can self-register; admins/lecturers created via admin panel
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT", // Public registration is for students only
      },
    });
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        name,
        intakeYear: new Date().getFullYear(),
        faculty: "",
        degree: "",
      },
    });
    return NextResponse.json({
      message: "Registered successfully. Please sign in.",
      userId: user.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
