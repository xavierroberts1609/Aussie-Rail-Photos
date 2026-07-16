import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_STATIONS, STATES, type StateCode } from "@/lib/locations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state || !STATES.some((s) => s.code === state)) {
    return NextResponse.json({ error: "A valid state is required." }, { status: 400 });
  }

  const photos = await prisma.photo.findMany({
    where: { state },
    select: { suburb: true, station: true },
  });

  const suburbs = new Set<string>();
  const stations = new Set<string>(SEED_STATIONS[state as StateCode]);

  for (const photo of photos) {
    if (photo.suburb) suburbs.add(photo.suburb);
    if (photo.station) stations.add(photo.station);
  }

  return NextResponse.json({
    suburbs: [...suburbs].sort((a, b) => a.localeCompare(b)),
    stations: [...stations].sort((a, b) => a.localeCompare(b)),
  });
}
