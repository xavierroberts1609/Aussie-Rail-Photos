import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/requireAdmin";
import { PHOTO_STATUS } from "@/lib/constants";
import { parsePhotoFields } from "@/lib/photoFields";

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

  const parsed = parsePhotoFields(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const data = parsed.data;

  if (body.status !== undefined) {
    if (!Object.values(PHOTO_STATUS).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
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
