"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminTag = { id: string; name: string };

export default function AdminTagsManager({ tags }: { tags: AdminTag[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setName("");
    router.refresh();
  }

  async function handleDelete(id: string, tagName: string) {
    if (!confirm(`Delete tag "${tagName}"? It will be removed from all photos.`)) return;
    setError("");
    setLoading(true);
    const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-2 rounded-full border border-ink-border px-3 py-1.5 text-sm text-bone-muted"
          >
            {tag.name}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDelete(tag.id, tag.name)}
              aria-label={`Delete tag ${tag.name}`}
              className="text-bone-muted hover:text-red-400 disabled:opacity-60"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex max-w-sm gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="input-field"
        />
        <button type="submit" disabled={loading || !name.trim()} className="btn-gold shrink-0 px-4 disabled:opacity-60">
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
