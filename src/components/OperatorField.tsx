"use client";

import { useEffect, useState } from "react";

const OTHER = "__other__";

export default function OperatorField({
  value,
  onChange,
  name = "operator",
}: {
  value: string;
  onChange: (value: string) => void;
  name?: string;
}) {
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"select" | "other">("select");

  useEffect(() => {
    fetch("/api/operators")
      .then((res) => res.json())
      .then((data) => {
        const cats: Record<string, string[]> = data.categories ?? {};
        setCategories(cats);
        const known = Object.values(cats).flat();
        setMode(value && !known.includes(value) ? "other" : "select");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label className="label-field" htmlFor="operator">Operator</label>
      {mode === "other" ? (
        <div className="flex gap-2">
          <input
            id="operator"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type operator"
            className="input-field"
          />
          <button
            type="button"
            onClick={() => {
              setMode("select");
              onChange("");
            }}
            className="shrink-0 rounded-sm border border-ink-border px-3 text-xs text-bone-muted hover:border-gold/50 hover:text-gold"
          >
            Choose
          </button>
        </div>
      ) : (
        <select
          id="operator"
          value={value}
          disabled={loading}
          onChange={(e) => {
            if (e.target.value === OTHER) {
              setMode("other");
              onChange("");
            } else {
              onChange(e.target.value);
            }
          }}
          className="input-field"
        >
          <option value="">Select operator</option>
          {Object.entries(categories).map(([group, options]) => (
            <optgroup key={group} label={group}>
              {options.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </optgroup>
          ))}
          <option value={OTHER}>Other (type new)...</option>
        </select>
      )}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
