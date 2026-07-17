"use client";

import { useEffect, useState } from "react";

export type Tag = { id: string; name: string };

export default function TagsField({
  value,
  onChange,
  name = "tags",
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  name?: string;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.tags ?? []))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div>
      <label className="label-field">Tags</label>
      {loading ? (
        <p className="text-sm text-bone-muted">Loading tags...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              aria-pressed={value.includes(tag.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                value.includes(tag.id)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-ink-border text-bone-muted hover:border-gold/50 hover:text-gold"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
      {value.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}
    </div>
  );
}
