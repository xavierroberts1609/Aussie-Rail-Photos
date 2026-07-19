"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pageSizeForWidth, parsePageSize } from "@/lib/pagination";

export default function PageSizeSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const correctSize = pageSizeForWidth(window.innerWidth);
    const currentSize = parsePageSize(searchParams.get("pageSize") ?? undefined);
    if (correctSize === currentSize) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", String(correctSize));
    params.delete("page");
    router.replace(`/gallery?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
