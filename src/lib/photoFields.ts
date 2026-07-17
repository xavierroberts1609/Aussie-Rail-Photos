import { prisma } from "@/lib/prisma";
import { STATES } from "@/lib/locations";

const TEXT_FIELDS = [
  "operator",
  "trainLine",
  "trainType",
  "consist",
  "suburb",
  "station",
  "locationDetail",
  "camera",
  "description",
] as const;

export async function parsePhotoFields(body: Record<string, unknown>): Promise<{ data: Record<string, unknown> } | { error: string }> {
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Title cannot be empty." };
    }
    data.title = body.title.trim();
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
      return { error: "Invalid tags." };
    }
    const tagIds = [...new Set(body.tags as string[])];
    if (tagIds.length === 0) {
      return { error: "Select at least one tag." };
    }
    const found = await prisma.tag.findMany({ where: { id: { in: tagIds } } });
    if (found.length !== tagIds.length) {
      return { error: "One or more tags are invalid." };
    }
    data.tags = { set: tagIds.map((id) => ({ id })) };
  }
  if (body.state !== undefined) {
    if (body.state && !STATES.some((s) => s.code === body.state)) {
      return { error: "Invalid state." };
    }
    data.state = body.state || null;
  }
  for (const field of TEXT_FIELDS) {
    if (body[field] !== undefined) {
      const value = body[field];
      data[field] = typeof value === "string" && value.trim() ? value.trim() : null;
    }
  }
  if (body.dateTaken !== undefined) {
    data.dateTaken = body.dateTaken ? new Date(body.dateTaken as string) : null;
  }

  return { data };
}
