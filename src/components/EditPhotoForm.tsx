"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import LocationFields from "@/components/LocationFields";
import OperatorField from "@/components/OperatorField";

export type EditablePhoto = {
  id: string;
  title: string;
  category: string;
  operator: string | null;
  trainLine: string | null;
  trainType: string | null;
  consist: string | null;
  state: string | null;
  suburb: string | null;
  station: string | null;
  locationDetail: string | null;
  camera: string | null;
  description: string | null;
  dateTaken: string | null;
};

export default function EditPhotoForm({
  photo,
  endpoint,
  redirectTo,
  notice,
}: {
  photo: EditablePhoto;
  endpoint: string;
  redirectTo: string;
  notice?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: photo.title,
    category: photo.category,
    operator: photo.operator ?? "",
    trainLine: photo.trainLine ?? "",
    trainType: photo.trainType ?? "",
    consist: photo.consist ?? "",
    state: photo.state ?? "",
    suburb: photo.suburb ?? "",
    station: photo.station ?? "",
    locationDetail: photo.locationDetail ?? "",
    camera: photo.camera ?? "",
    description: photo.description ?? "",
    dateTaken: photo.dateTaken ? photo.dateTaken.slice(0, 10) : "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {notice && (
        <p className="rounded-md border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-gold">
          {notice}
        </p>
      )}
      <div>
        <label className="label-field" htmlFor="title">Title</label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="input-field"
        />
      </div>

      <OperatorField value={form.operator} onChange={(v) => update("operator", v)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="trainLine">Train Line / Network</label>
          <input
            id="trainLine"
            value={form.trainLine}
            onChange={(e) => update("trainLine", e.target.value)}
            placeholder="e.g. Sunbury Metro Line"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="trainType">Train Type</label>
          <input
            id="trainType"
            value={form.trainType}
            onChange={(e) => update("trainType", e.target.value)}
            placeholder="e.g. N Class"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="consist">Consist</label>
        <input
          id="consist"
          value={form.consist}
          onChange={(e) => update("consist", e.target.value)}
          placeholder="e.g. CLF1, CLF4, 4910, G514"
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="category">Category</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="input-field"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <LocationFields
        value={{
          state: form.state,
          suburb: form.suburb,
          station: form.station,
          locationDetail: form.locationDetail,
        }}
        onChange={(loc) => setForm((f) => ({ ...f, ...loc }))}
      />

      <div>
        <label className="label-field" htmlFor="camera">Camera / Equipment</label>
        <input
          id="camera"
          value={form.camera}
          onChange={(e) => update("camera", e.target.value)}
          placeholder="e.g. Canon R8"
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="dateTaken">Date Taken</label>
        <input
          id="dateTaken"
          type="date"
          value={form.dateTaken}
          onChange={(e) => update("dateTaken", e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input-field"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-gold disabled:opacity-60">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push(redirectTo)}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
