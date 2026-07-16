"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  function selectCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/gallery?${params.toString()}`);
  }

  const options = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((category) => (
        <button
          key={category}
          onClick={() => selectCategory(category)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            active === category
              ? "border-gold bg-gold/10 text-gold"
              : "border-ink-border text-bone-muted hover:border-gold/50 hover:text-gold"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
