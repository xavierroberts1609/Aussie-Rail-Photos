import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import PhotoCard from "@/components/PhotoCard";
import SearchBar from "@/components/SearchBar";
import TagsFilter from "@/components/TagsFilter";
import SortSelect from "@/components/SortSelect";
import { isSortKey, sortToOrderBy, type SortKey } from "@/lib/sort";
import { buildSearchFilter, parseTagIds } from "@/lib/photoQuery";

export const dynamic = "force-dynamic";

export default async function PhotographerDetailPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { tags?: string; q?: string; sort?: string };
}) {
  const name = decodeURIComponent(params.name);
  const photographer = await prisma.user.findFirst({
    where: { name },
  });

  if (!photographer) notFound();

  const tagIds = parseTagIds(searchParams.tags);
  const q = searchParams.q;
  const sort: SortKey = isSortKey(searchParams.sort) ? searchParams.sort : "uploaded_desc";
  const basePath = `/photographers/${encodeURIComponent(photographer.name)}`;

  const where = {
    photographerId: photographer.id,
    status: PHOTO_STATUS.APPROVED,
    ...buildSearchFilter(tagIds, q),
  };

  const [photos, allTags, totalCount] = await Promise.all([
    prisma.photo.findMany({
      where,
      include: { photographer: { select: { name: true } } },
      orderBy: sortToOrderBy(sort),
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.photo.count({ where: { photographerId: photographer.id, status: PHOTO_STATUS.APPROVED } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/photographers" className="text-sm text-bone-muted hover:text-gold">
        ← Photographers
      </Link>
      <h1 className="mt-4 font-display text-4xl text-bone">
        <span className="text-gold">{photographer.name}</span>
      </h1>
      <p className="mt-2 text-bone-muted">
        {totalCount} photo{totalCount === 1 ? "" : "s"}
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Suspense fallback={<div className="input-field max-w-md" />}>
          <SearchBar basePath={basePath} />
        </Suspense>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense fallback={null}>
            <TagsFilter tags={allTags} basePath={basePath} />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect basePath={basePath} />
          </Suspense>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="panel mt-10 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="font-display text-xl text-bone">No photos match</p>
          <p className="max-w-sm text-sm text-bone-muted">
            {q || tagIds.length > 0
              ? "No photos match your search or filter. Try clearing them."
              : "This photographer hasn't had a photo approved yet."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
