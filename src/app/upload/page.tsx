"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LocationFields, { type LocationValue } from "@/components/LocationFields";
import OperatorField from "@/components/OperatorField";
import TagsField from "@/components/TagsField";

export default function UploadPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [operator, setOperator] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationValue>({
    state: "",
    suburb: "",
    station: "",
    locationDetail: "",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push(`/photo/${data.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Share Your Shots</p>
      <h1 className="mt-2 font-display text-4xl text-bone">Upload Photo</h1>
      <p className="mt-2 text-bone-muted">Share your Aussie train photos with fellow rail enthusiasts</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6" encType="multipart/form-data">
        <div>
          <label className="label-field">Photo</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-ink-border bg-ink-raised text-center transition-colors hover:border-gold/60"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-full w-full rounded-sm object-cover" />
            ) : (
              <>
                <span className="text-bone">Click to upload your photo</span>
                <span className="text-xs text-bone-muted">JPG, PNG, WebP supported</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="label-field" htmlFor="title">Title *</label>
          <input id="title" name="title" required placeholder="Give your photo a title" className="input-field" />
        </div>

        <OperatorField value={operator} onChange={setOperator} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="trainLine">Train Line / Network</label>
            <input id="trainLine" name="trainLine" placeholder="e.g. Sunbury Metro Line" className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="trainType">Train Type</label>
            <input id="trainType" name="trainType" placeholder="e.g. N Class" className="input-field" />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="consist">Consist</label>
          <input id="consist" name="consist" placeholder="e.g. CLF1, CLF4, 4910, G514" className="input-field" />
        </div>

        <TagsField value={tags} onChange={setTags} />

        <LocationFields value={location} onChange={setLocation} />

        <div>
          <label className="label-field" htmlFor="camera">Camera / Equipment</label>
          <input id="camera" name="camera" placeholder="e.g. Canon R8" className="input-field" />
        </div>

        <div>
          <label className="label-field" htmlFor="dateTaken">Date Taken</label>
          <input id="dateTaken" name="dateTaken" type="date" className="input-field" />
        </div>

        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className="input-field" />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
          {loading ? "Publishing..." : "Publish Photo"}
        </button>
      </form>
    </div>
  );
}
