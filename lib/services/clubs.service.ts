// Clubs service: CRUD and application handling

import { prisma } from "../prisma";

export async function getClubWithMemberCount(clubId: string) {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: { _count: { select: { members: true } } },
  });
  return club;
}
