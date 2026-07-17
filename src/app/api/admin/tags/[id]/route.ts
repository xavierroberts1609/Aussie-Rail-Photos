import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/requireAdmin";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const tag = await prisma.tag.findUnique({ where: { id: params.id } });
  if (!tag) {
    return NextResponse.json({ error: "Tag not found." }, { status: 404 });
  }

  await prisma.tag.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
