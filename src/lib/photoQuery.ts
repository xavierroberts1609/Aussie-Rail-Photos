import type { Prisma } from "@prisma/client";

export function buildSearchFilter(tagIds: string[], q: string | undefined): Prisma.PhotoWhereInput {
  return {
    ...(tagIds.length > 0 ? { tags: { some: { id: { in: tagIds } } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { operator: { contains: q } },
            { trainLine: { contains: q } },
            { trainType: { contains: q } },
            { consist: { contains: q } },
            { suburb: { contains: q } },
            { station: { contains: q } },
            { locationDetail: { contains: q } },
            { photographer: { name: { contains: q } } },
          ],
        }
      : {}),
  };
}

export function parseTagIds(tags: string | undefined): string[] {
  return tags ? tags.split(",").filter(Boolean) : [];
}
