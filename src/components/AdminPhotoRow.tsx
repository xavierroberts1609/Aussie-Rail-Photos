"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminPhotoData = {
  id: string;
  title: string;
  imageUrl: string;
  status: string;
  tags: { id: string; name: string }[];
  createdAt: string;
  photographer: { name: string };
};

export default function AdminPhotoRow({ photo }: { photo: AdminPhotoData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function setStatus(status: "APPROVED" | "PENDING") {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-ink-raised">
        <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/photo/${photo.id}`} className="font-display text-bone hover:text-gold">
            {photo.title}
          </Link>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
              photo.status === "APPROVED"
                ? "bg-green-500/10 text-green-400"
                : "bg-gold/10 text-gold"
            }`}
          >
            {photo.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-bone-muted">
          by {photo.photographer.name}
          {photo.tags.length > 0 && ` · ${photo.tags.map((t) => t.name).join(", ")}`}
        </p>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {photo.status === "PENDING" ? (
          <button
            disabled={loading}
            onClick={() => setStatus("APPROVED")}
            className="btn-gold px-3 py-1.5 text-xs disabled:opacity-60"
          >
            Approve
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={() => setStatus("PENDING")}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-60"
          >
            Unpublish
          </button>
        )}
        <Link href={`/admin/photos/${photo.id}/edit`} className="btn-outline px-3 py-1.5 text-xs">
          Edit
        </Link>
        <button
          disabled={loading}
          onClick={handleDelete}
          className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
