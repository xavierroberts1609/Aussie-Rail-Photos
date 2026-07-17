"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type FilterTag = { id: string; name: string };

export default function TagsFilter({ tags }: { tags: FilterTag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeIds = (searchParams.get("tags") || "").split(",").filter(Boolean);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyTags(ids: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (ids.length > 0) {
      params.set("tags", ids.join(","));
    } else {
      params.delete("tags");
    }
    router.push(`/gallery?${params.toString()}`);
  }

  function toggleTag(id: string) {
    applyTags(activeIds.includes(id) ? activeIds.filter((v) => v !== id) : [...activeIds, id]);
  }

  return (
    <div ref={panelRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors ${
          activeIds.length > 0
            ? "border-gold bg-gold/10 text-gold"
            : "border-ink-border text-bone-muted hover:border-gold/50 hover:text-gold"
        }`}
      >
        Filters{activeIds.length > 0 ? ` (${activeIds.length})` : ""}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-md border border-ink-border bg-ink-panel p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm text-bone-muted hover:text-bone">
                <input
                  type="checkbox"
                  checked={activeIds.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  className="accent-gold"
                />
                {tag.name}
              </label>
            ))}
          </div>
          {activeIds.length > 0 && (
            <button
              type="button"
              onClick={() => applyTags([])}
              className="mt-3 text-xs text-gold hover:text-gold-light"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
