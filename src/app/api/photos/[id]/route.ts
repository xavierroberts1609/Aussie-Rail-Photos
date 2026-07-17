import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import { parsePhotoFields } from "@/lib/photoFields";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  if (photo.photographerId !== userId) {
    return NextResponse.json({ error: "You can only edit your own photos." }, { status: 403 });
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
  data.status = PHOTO_STATUS.PENDING;

  const updated = await prisma.photo.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, photo: updated });
}
