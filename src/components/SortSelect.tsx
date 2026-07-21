"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, isSortKey, type SortKey } from "@/lib/sort";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSort: SortKey = isSortKey(searchParams.get("sort") ?? undefined)
    ? (searchParams.get("sort") as SortKey)
    : "uploaded_desc";

  function handleChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "uploaded_desc") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    params.delete("page");
    router.push(`/gallery?${params.toString()}`);
  }

  return (
    <select
      value={activeSort}
      onChange={(e) => handleChange(e.target.value)}
      className="input-field w-fit py-2 text-sm"
      aria-label="Sort photos"
    >
      {Object.entries(SORT_OPTIONS).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}
