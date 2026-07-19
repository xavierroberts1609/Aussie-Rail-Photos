import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS, ROLES } from "@/lib/constants";
import { STATES } from "@/lib/locations";
import { extractDateTaken } from "@/lib/exif";
import { optimizeUpload } from "@/lib/imageProcessing";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to upload." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");
  const title = formData.get("title");
  const tagIds = [...new Set(formData.getAll("tags").filter((v): v is string => typeof v === "string" && v.length > 0))];
  const operator = formData.get("operator");
  const trainLine = formData.get("trainLine");
  const trainType = formData.get("trainType");
  const consist = formData.get("consist");
  const state = formData.get("state");
  const suburb = formData.get("suburb");
  const station = formData.get("station");
  const locationDetail = formData.get("locationDetail");
  const camera = formData.get("camera");
  const dateTaken = formData.get("dateTaken");
  const description = formData.get("description");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A photo file is required." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG and WebP images are supported." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be smaller than 30MB." }, { status: 400 });
  }
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (tagIds.length === 0) {
    return NextResponse.json({ error: "Select at least one tag." }, { status: 400 });
  }
  const validTags = await prisma.tag.findMany({ where: { id: { in: tagIds } } });
  if (validTags.length !== tagIds.length) {
    return NextResponse.json({ error: "One or more tags are invalid." }, { status: 400 });
  }
  if (typeof state === "string" && state && !STATES.some((s) => s.code === state)) {
    return NextResponse.json({ error: "Invalid state." }, { status: 400 });
  }

  const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  const exifDateTaken = await extractDateTaken(buffer);
  const manualDateTaken = typeof dateTaken === "string" && dateTaken ? new Date(dateTaken) : null;

  const optimized = await optimizeUpload(buffer, file.type);
  await writeFile(filePath, optimized);

  const photo = await prisma.photo.create({
    data: {
      title: title.trim(),
      imageUrl: `/api/uploads/${filename}`,
      tags: { connect: tagIds.map((id) => ({ id })) },
      operator: typeof operator === "string" && operator.trim() ? operator.trim() : null,
      trainLine: typeof trainLine === "string" && trainLine.trim() ? trainLine.trim() : null,
      trainType: typeof trainType === "string" && trainType.trim() ? trainType.trim() : null,
      consist: typeof consist === "string" && consist.trim() ? consist.trim() : null,
      state: typeof state === "string" && state ? state : null,
      suburb: typeof suburb === "string" && suburb.trim() ? suburb.trim() : null,
      station: typeof station === "string" && station.trim() ? station.trim() : null,
      locationDetail: typeof locationDetail === "string" && locationDetail.trim() ? locationDetail.trim() : null,
      camera: typeof camera === "string" && camera.trim() ? camera.trim() : null,
      dateTaken: exifDateTaken ?? manualDateTaken,
      description: typeof description === "string" && description.trim() ? description.trim() : null,
      photographerId: userId,
      status: session.user.role === ROLES.ADMIN ? PHOTO_STATUS.APPROVED : PHOTO_STATUS.PENDING,
    },
  });

  return NextResponse.json({ ok: true, id: photo.id, status: photo.status });
}
