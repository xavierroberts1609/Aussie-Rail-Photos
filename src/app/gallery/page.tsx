import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { PHOTO_STATUS } from "@/lib/constants";
import PhotoCard from "@/components/PhotoCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

async function getPhotos(category?: string, q?: string) {
  return prisma.photo.findMany({
    where: {
      status: PHOTO_STATUS.APPROVED,
      ...(category && category !== "All" ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { operator: { contains: q } },
              { trainLine: { contains: q } },
              { trainType: { contains: q } },
              { consist: { contains: q } },
              { suburb: { contains: q } },
              { station: { contains: q } },
              { locationDetail: { contains: q } },
              { photographer: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { photographer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = searchParams.category;
  const q = searchParams.q;
  const photos = await getPhotos(category, q);

  const [photoCount, photographerCount] = await Promise.all([
    prisma.photo.count({ where: { status: PHOTO_STATUS.APPROVED } }),
    prisma.user.count({ where: { photos: { some: { status: PHOTO_STATUS.APPROVED } } } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-6 border-b border-ink-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-bone">
            Aussie <span className="text-gold">Trains</span>
          </h1>
          <p className="mt-2 text-bone-muted">
            Showcasing the best of Australian railway photography
          </p>
        </div>
        <Link href="/upload" className="btn-gold shrink-0">
          Upload Photo
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Suspense fallback={<div className="input-field max-w-md" />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
      </div>

      {photos.length === 0 ? (
        <div className="panel mt-12 flex flex-col items-center gap-3 px-6 py-20 text-center">
          <p className="font-display text-2xl text-bone">No photos yet</p>
          <p className="max-w-sm text-sm text-bone-muted">
            {q || category
              ? "No photos match your search or filter. Try clearing them."
              : "Be the first to upload a shot of Australian rail."}
          </p>
          <Link href="/upload" className="btn-gold mt-2">
            Upload Photo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-4 border-t border-ink-border pt-10 text-center">
        <div>
          <p className="font-display text-3xl text-gold">{photoCount}</p>
          <p className="text-xs text-bone-muted">Photos</p>
        </div>
        <div>
          <p className="font-display text-3xl text-gold">{photographerCount}</p>
          <p className="text-xs text-bone-muted">Photographers</p>
        </div>
        <div>
          <p className="font-display text-3xl text-gold">{CATEGORIES.length}</p>
          <p className="text-xs text-bone-muted">Categories</p>
        </div>
      </div>
    </div>
  );
}
