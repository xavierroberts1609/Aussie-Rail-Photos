"use client";

import PhotoCard, { type PhotoCardData } from "@/components/PhotoCard";

export default function NewestPhotosMarquee({ photos }: { photos: PhotoCardData[] }) {
  return (
    <div className="group overflow-hidden">
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {[...photos, ...photos].map((photo, i) => (
          <div key={`${photo.id}-${i}`} className="w-56 shrink-0">
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>
    </div>
  );
}
