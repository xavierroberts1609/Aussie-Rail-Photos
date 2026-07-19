import type { Prisma } from "@prisma/client";

export const SORT_OPTIONS = {
  uploaded_desc: "Upload Date: Newest",
  uploaded_asc: "Upload Date: Oldest",
  taken_desc: "Date Taken: Newest",
  taken_asc: "Date Taken: Oldest",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export function isSortKey(value: string | undefined): value is SortKey {
  return !!value && value in SORT_OPTIONS;
}

export function sortToOrderBy(sort: SortKey): Prisma.PhotoOrderByWithRelationInput {
  switch (sort) {
    case "uploaded_asc":
      return { createdAt: "asc" };
    case "taken_desc":
      return { dateTaken: "desc" };
    case "taken_asc":
      return { dateTaken: "asc" };
    case "uploaded_desc":
    default:
      return { createdAt: "desc" };
  }
}
