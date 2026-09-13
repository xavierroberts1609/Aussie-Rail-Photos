import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import AdminPhotoRow from "@/components/AdminPhotoRow";
import AdminNameChangeRow from "@/components/AdminNameChangeRow";
import AdminTagsManager from "@/components/AdminTagsManager";
import SearchBar from "@/components/SearchBar";
import TagsFilter from "@/components/TagsFilter";
import SortSelect from "@/components/SortSelect";
import { isSortKey, sortToOrderBy, type SortKey } from "@/lib/sort";
import { buildSearchFilter, parseTagIds } from "@/lib/photoQuery";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { tags?: string; q?: string; sort?: string };
}) {
  const tagIds = parseTagIds(searchParams.tags);
  const q = searchParams.q;
  const sort: SortKey = isSortKey(searchParams.sort) ? searchParams.sort : "uploaded_desc";

  const [pending, allPhotos, pendingNameChanges, tags] = await Promise.all([
    prisma.photo.findMany({
      where: { status: PHOTO_STATUS.PENDING },
      include: { photographer: { select: { name: true } }, tags: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.photo.findMany({
      where: buildSearchFilter(tagIds, q),
      include: { photographer: { select: { name: true } }, tags: true },
      orderBy: sortToOrderBy(sort),
    }),
    prisma.user.findMany({
      where: { pendingName: { not: null } },
      select: { id: true, name: true, pendingName: true, email: true },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serialize = (p: (typeof allPhotos)[number]) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-4xl text-bone">
        Admin <span className="text-gold">Panel</span>
      </h1>
      <p className="mt-2 text-bone-muted">Approve, edit, or remove submitted photos.</p>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-bone">
          Pending Name Changes <span className="text-gold">({pendingNameChanges.length})</span>
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {pendingNameChanges.length === 0 ? (
            <p className="text-sm text-bone-muted">Nothing waiting on review.</p>
          ) : (
            pendingNameChanges.map((user) => (
              <AdminNameChangeRow
                key={user.id}
                user={{ id: user.id, name: user.name, pendingName: user.pendingName!, email: user.email }}
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-bone">
          Pending Approval <span className="text-gold">({pending.length})</span>
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {pending.length === 0 ? (
            <p className="text-sm text-bone-muted">Nothing waiting on review.</p>
          ) : (
            pending.map((photo) => <AdminPhotoRow key={photo.id} photo={serialize(photo)} />)
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-bone">
          All Photos <span className="text-gold">({allPhotos.length})</span>
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <Suspense fallback={<div className="input-field max-w-md" />}>
            <SearchBar basePath="/admin" />
          </Suspense>
          <div className="flex flex-wrap items-center gap-3">
            <Suspense fallback={null}>
              <TagsFilter tags={tags} basePath="/admin" />
            </Suspense>
            <Suspense fallback={null}>
              <SortSelect basePath="/admin" />
            </Suspense>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {allPhotos.length === 0 ? (
            <p className="text-sm text-bone-muted">
              {q || tagIds.length > 0 ? "No photos match your search or filter." : "No photos have been uploaded yet."}
            </p>
          ) : (
            allPhotos.map((photo) => <AdminPhotoRow key={photo.id} photo={serialize(photo)} />)
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-bone">
          Tags <span className="text-gold">({tags.length})</span>
        </h2>
        <p className="mt-1 text-sm text-bone-muted">
          Manage the fixed set of tags photographers can apply to their photos.
        </p>
        <AdminTagsManager tags={tags} />
      </section>
    </div>
  );
}
