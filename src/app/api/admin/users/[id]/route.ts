import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/requireAdmin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const action = body?.action;

  if (action !== "approveName" && action !== "rejectName") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }
  if (!user.pendingName) {
    return NextResponse.json({ error: "This user has no pending name change." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: {
      name: action === "approveName" ? user.pendingName : user.name,
      pendingName: null,
    },
  });

  return NextResponse.json({ ok: true, name: updated.name });
}
