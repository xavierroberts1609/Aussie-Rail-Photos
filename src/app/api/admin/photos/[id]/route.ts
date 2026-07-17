import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/requireAdmin";
import { CATEGORIES } from "@/lib/categories";
import { PHOTO_STATUS } from "@/lib/constants";
import { STATES } from "@/lib/locations";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!Object.values(PHOTO_STATUS).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    data.category = body.category;
  }
  if (body.state !== undefined) {
    if (body.state && !STATES.some((s) => s.code === body.state)) {
      return NextResponse.json({ error: "Invalid state." }, { status: 400 });
    }
    data.state = body.state || null;
  }
  for (const field of ["operator", "trainLine", "trainType", "consist", "suburb", "station", "locationDetail", "camera", "description"] as const) {
    if (body[field] !== undefined) {
      data[field] = typeof body[field] === "string" && body[field].trim() ? body[field].trim() : null;
    }
  }
  if (body.dateTaken !== undefined) {
    data.dateTaken = body.dateTaken ? new Date(body.dateTaken) : null;
  }

  const updated = await prisma.photo.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, photo: updated });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  await prisma.photo.delete({ where: { id: params.id } });

  if (photo.imageUrl.startsWith("/uploads/") || photo.imageUrl.startsWith("/api/uploads/")) {
    const filePath = path.join(process.cwd(), "public", "uploads", path.basename(photo.imageUrl));
    await unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
