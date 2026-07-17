import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Tag name is required." }, { status: 400 });
  }

  const existing = await prisma.tag.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json({ error: "A tag with that name already exists." }, { status: 409 });
  }

  const tag = await prisma.tag.create({ data: { name } });
  return NextResponse.json({ ok: true, tag });
}
