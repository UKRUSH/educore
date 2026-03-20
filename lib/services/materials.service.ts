// Materials service: CRUD, summarize stub, suggest by subject/tags

import { prisma } from "../prisma";

export async function getRelatedMaterials(materialId: string, limit = 5) {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
  });
  if (!material) return [];

  const subject = material.subject;
  const tags = material.tags || [];

  const related = await prisma.material.findMany({
    where: {
      id: { not: materialId },
      OR: [
        ...(subject ? [{ subject }] : []),
        ...(tags.length ? [{ tags: { hasSome: tags } }] : []),
      ].filter(Boolean),
    },
    take: limit,
  });
  return related;
}
