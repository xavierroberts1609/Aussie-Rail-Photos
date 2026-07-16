import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PhotographersPage() {
  const approved = { status: PHOTO_STATUS.APPROVED };
  const users = await prisma.user.findMany({
    where: { photos: { some: approved } },
    select: { id: true, name: true, _count: { select: { photos: { where: approved } } } },
  });
  const photographers = users.sort((a, b) => b._count.photos - a._count.photos);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-bone">
        <span className="text-gold">Photographers</span>
      </h1>
      <p className="mt-2 text-bone-muted">
        {photographers.length} contributor{photographers.length === 1 ? "" : "s"}
      </p>

      {photographers.length === 0 ? (
        <div className="panel mt-10 px-6 py-16 text-center">
          <p className="font-display text-xl text-bone">No contributors yet</p>
          <p className="mt-2 text-sm text-bone-muted">
            Sign up and upload a photo to be the first.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-ink-border border-y border-ink-border">
          {photographers.map((p) => (
            <li key={p.id}>
              <Link
                href={`/photographers/${encodeURIComponent(p.name)}`}
                className="group flex items-center justify-between px-2 py-5 transition-colors hover:bg-ink-panel"
              >
                <div>
                  <p className="font-display text-lg text-bone group-hover:text-gold">{p.name}</p>
                  <p className="text-sm text-bone-muted">
                    {p._count.photos} photo{p._count.photos === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-gold">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
