import { CATEGORIES } from "@/lib/categories";
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

export function parsePhotoFields(body: Record<string, unknown>): { data: Record<string, unknown> } | { error: string } {
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Title cannot be empty." };
    }
    data.title = body.title.trim();
  }
  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category as (typeof CATEGORIES)[number])) {
      return { error: "Invalid category." };
    }
    data.category = body.category;
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
