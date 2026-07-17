import Link from "next/link";
import Image from "next/image";
import { formatLocationLine } from "@/lib/locations";

export type PhotoCardData = {
  id: string;
  title: string;
  imageUrl: string;
  operator?: string | null;
  trainLine?: string | null;
  trainType?: string | null;
  state?: string | null;
  suburb?: string | null;
  station?: string | null;
  photographer: { name: string };
};

export default function PhotoCard({ photo }: { photo: PhotoCardData }) {
  const meta = [photo.operator, photo.trainType, photo.trainLine].filter(Boolean).join(", ");
  const location = formatLocationLine(photo);

  return (
    <Link
      href={`/photo/${photo.id}`}
      className="group panel block overflow-hidden transition-colors hover:border-gold/60"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-raised">
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          quality={100}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-bone group-hover:text-gold">{photo.title}</h3>
        <p className="mt-1 text-sm text-bone-muted">by {photo.photographer.name}</p>
        {meta && <p className="mt-2 text-xs text-bone-muted">{meta}</p>}
        {location && <p className="text-xs text-bone-muted">{location}</p>}
      </div>
    </Link>
  );
}
