// Support service: lecturers, sessions, community (stub helpers)

import { prisma } from "../prisma";

export async function getVerifiedLecturers() {
  return prisma.lecturerProfile.findMany({
    where: { isVerified: true },
    include: { user: { select: { email: true } } },
  });
}
