import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_OPERATORS, ALL_SEED_OPERATORS } from "@/lib/operators";

export async function GET() {
  const photos = await prisma.photo.findMany({
    where: { operator: { not: null } },
    select: { operator: true },
    distinct: ["operator"],
  });

  const custom = photos
    .map((p) => p.operator)
    .filter((op): op is string => !!op && !ALL_SEED_OPERATORS.includes(op))
    .sort((a, b) => a.localeCompare(b));

  return NextResponse.json({
    categories: {
      ...SEED_OPERATORS,
      ...(custom.length > 0 ? { "Community Added": custom } : {}),
    },
  });
}
