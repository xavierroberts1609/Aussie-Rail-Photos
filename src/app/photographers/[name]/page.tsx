import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PHOTO_STATUS } from "@/lib/constants";
import PhotoCard from "@/components/PhotoCard";

export const dynamic = "force-dynamic";

export default async function PhotographerDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const name = decodeURIComponent(params.name);
  const photographer = await prisma.user.findFirst({
    where: { name },
  });

  if (!photographer) notFound();

  const photos = await prisma.photo.findMany({
    where: { photographerId: photographer.id, status: PHOTO_STATUS.APPROVED },
    include: { photographer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/photographers" className="text-sm text-bone-muted hover:text-gold">
        ← Photographers
      </Link>
      <h1 className="mt-4 font-display text-4xl text-bone">
        <span className="text-gold">{photographer.name}</span>
      </h1>
      <p className="mt-2 text-bone-muted">
        {photos.length} photo{photos.length === 1 ? "" : "s"}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
