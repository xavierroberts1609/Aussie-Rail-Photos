import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PHOTO_STATUS, ROLES } from "@/lib/constants";
import { stateLabel } from "@/lib/locations";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "long" }).format(date);
}

export default async function PhotoDetailPage({ params }: { params: { id: string } }) {
  const photo = await prisma.photo.findUnique({
    where: { id: params.id },
    include: { photographer: { select: { name: true } } },
  });

  if (!photo) notFound();

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === photo.photographerId;
  const isAdmin = session?.user?.role === ROLES.ADMIN;

  if (photo.status !== PHOTO_STATUS.APPROVED && !isOwner && !isAdmin) {
    notFound();
  }

  const details: { label: string; value: string }[] = [
    ...(photo.operator ? [{ label: "Operator", value: photo.operator }] : []),
    ...(photo.trainLine ? [{ label: "Train Line / Network", value: photo.trainLine }] : []),
    ...(photo.trainType ? [{ label: "Train Type / Class", value: photo.trainType }] : []),
    ...(photo.consist ? [{ label: "Consist", value: photo.consist }] : []),
    ...(photo.station ? [{ label: "Closest Station", value: photo.station }] : []),
    ...(photo.suburb ? [{ label: "Suburb", value: photo.suburb }] : []),
    ...(photo.state ? [{ label: "State", value: stateLabel(photo.state) }] : []),
    ...(photo.locationDetail ? [{ label: "Location Detail", value: photo.locationDetail }] : []),
    ...(photo.camera ? [{ label: "Camera", value: photo.camera }] : []),
    { label: "Category", value: photo.category },
    ...(photo.dateTaken ? [{ label: "Date Taken", value: formatDate(photo.dateTaken)! }] : []),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-bone-muted">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <Link href="/gallery" className="hover:text-gold">Gallery</Link>
      </div>

      <div className="relative mt-6 w-full overflow-hidden rounded-md border border-ink-border bg-ink-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.imageUrl} alt={photo.title} className="block h-auto w-full" />
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {photo.status === PHOTO_STATUS.PENDING && (
          <span className="w-fit rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs text-gold">
            Pending approval — only visible to you and admins
          </span>
        )}
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl text-bone">{photo.title}</h1>
          {isOwner && (
            <Link
              href={`/photo/${photo.id}/edit`}
              className="btn-outline shrink-0 text-sm"
            >
              Edit Photo
            </Link>
          )}
        </div>
        <p className="text-bone-muted">
          by{" "}
          <Link
            href={`/photographers/${encodeURIComponent(photo.photographer.name)}`}
            className="text-gold hover:text-gold-light"
          >
            {photo.photographer.name}
          </Link>
        </p>
      </div>

      {photo.description && <p className="mt-6 text-bone-muted">{photo.description}</p>}

      <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-ink-border pt-8 sm:grid-cols-2">
        {details.map((d) => (
          <div key={d.label}>
            <dt className="text-xs uppercase tracking-wide text-bone-muted">{d.label}</dt>
            <dd className="mt-1 text-bone">{d.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
