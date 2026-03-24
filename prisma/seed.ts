/**
 * Seed: demo user, admin user, and sample clubs.
 * Run with: npx ts-node prisma/seed.ts (or tsx prisma/seed.ts)
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await hash("admin123", 10);
  const studentHash = await hash("student123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@educore.edu" },
    update: {},
    create: {
      email: "admin@educore.edu",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@educore.edu" },
    update: {},
    create: {
      email: "student@educore.edu",
      passwordHash: studentHash,
      role: "STUDENT",
    },
  });

  const profile = await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      name: "Demo Student",
      intakeYear: 2023,
      faculty: "Engineering",
      degree: "BSc CS",
    },
  });

  const clubs = [
    { name: "Coding Club", description: "Learn and build together", category: "Academic", capacity: 30 },
    { name: "Football", description: "University football team", category: "Sports", capacity: 25 },
    { name: "Music Society", description: "Band and performances", category: "Arts", capacity: 40 },
  ];

  for (const c of clubs) {
    const existing = await prisma.club.findFirst({ where: { name: c.name } });
    if (!existing) await prisma.club.create({ data: c });
  }

  console.log("Seeded:", { adminId: admin.id, studentId: student.id, profileId: profile.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
