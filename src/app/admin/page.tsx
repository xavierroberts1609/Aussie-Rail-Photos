import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import AdminPhotoRow from "@/components/AdminPhotoRow";
import AdminNameChangeRow from "@/components/AdminNameChangeRow";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const photos = await prisma.photo.findMany({
    include: { photographer: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const pendingNameChanges = await prisma.user.findMany({
    where: { pendingName: { not: null } },
    select: { id: true, name: true, pendingName: true, email: true },
  });

  const pending = photos.filter((p) => p.status === PHOTO_STATUS.PENDING);

  const serialize = (p: (typeof photos)[number]) => ({
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
          All Photos <span className="text-gold">({photos.length})</span>
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {photos.length === 0 ? (
            <p className="text-sm text-bone-muted">No photos have been uploaded yet.</p>
          ) : (
            photos.map((photo) => <AdminPhotoRow key={photo.id} photo={serialize(photo)} />)
          )}
        </div>
      </section>
    </div>
  );
}
