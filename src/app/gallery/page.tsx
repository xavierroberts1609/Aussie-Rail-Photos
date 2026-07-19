import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import PhotoCard from "@/components/PhotoCard";
import TagsFilter from "@/components/TagsFilter";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import PageSizeSync from "@/components/PageSizeSync";
import { isSortKey, sortToOrderBy, type SortKey } from "@/lib/sort";
import { parsePage, parsePageSize } from "@/lib/pagination";

export const dynamic = "force-dynamic";

function buildWhere(tagIds: string[], q: string | undefined) {
  return {
    status: PHOTO_STATUS.APPROVED,
    ...(tagIds.length > 0 ? { tags: { some: { id: { in: tagIds } } } } : {}),
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
  };
}

async function getPhotos(tagIds: string[], q: string | undefined, sort: SortKey, page: number, pageSize: number) {
  const where = buildWhere(tagIds, q);
  const total = await prisma.photo.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const photos = await prisma.photo.findMany({
    where,
    include: { photographer: { select: { name: true } } },
    orderBy: sortToOrderBy(sort),
    skip: (clampedPage - 1) * pageSize,
    take: pageSize,
  });

  return { photos, total, totalPages, page: clampedPage };
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { tags?: string; q?: string; sort?: string; page?: string; pageSize?: string };
}) {
  const tagIds = searchParams.tags ? searchParams.tags.split(",").filter(Boolean) : [];
  const q = searchParams.q;
  const sort: SortKey = isSortKey(searchParams.sort) ? searchParams.sort : "uploaded_desc";
  const pageSize = parsePageSize(searchParams.pageSize);
  const requestedPage = parsePage(searchParams.page);
  const [{ photos, totalPages, page }, allTags] = await Promise.all([
    getPhotos(tagIds, q, sort, requestedPage, pageSize),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const [photoCount, photographerCount, operators] = await Promise.all([
    prisma.photo.count({ where: { status: PHOTO_STATUS.APPROVED } }),
    prisma.user.count({ where: { photos: { some: { status: PHOTO_STATUS.APPROVED } } } }),
    prisma.photo.findMany({
      where: { status: PHOTO_STATUS.APPROVED, operator: { not: null } },
      select: { operator: true },
      distinct: ["operator"],
    }),
  ]);
  const operatorCount = operators.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={null}>
        <PageSizeSync />
      </Suspense>
      <div className="flex flex-col gap-6 border-b border-ink-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-bone">
            <span className="text-gold">Gallery</span>
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
        <div className="flex flex-wrap items-center gap-3">
          <Suspense fallback={null}>
            <TagsFilter tags={allTags} />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
        <p className="text-xs text-bone-muted">
          On large screens, photo thumbnails may appear low quality. To see the best quality, click into the photo.
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="panel mt-12 flex flex-col items-center gap-3 px-6 py-20 text-center">
          <p className="font-display text-2xl text-bone">No photos yet</p>
          <p className="max-w-sm text-sm text-bone-muted">
            {q || tagIds.length > 0
              ? "No photos match your search or filter. Try clearing them."
              : "Be the first to upload a shot of Australian rail."}
          </p>
          <Link href="/upload" className="btn-gold mt-2">
            Upload Photo
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </>
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
          <p className="font-display text-3xl text-gold">{operatorCount}</p>
          <p className="text-xs text-bone-muted">Operators</p>
        </div>
      </div>
    </div>
  );
}
