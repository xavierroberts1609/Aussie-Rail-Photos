"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type PendingNameUser = {
  id: string;
  name: string;
  pendingName: string;
  email: string;
};

export default function AdminNameChangeRow({ user }: { user: PendingNameUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle(action: "approveName" | "rejectName") {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="text-sm text-bone-muted">{user.email}</p>
        <p className="mt-1 text-bone">
          <span className="text-bone-muted">{user.name}</span>
          <span className="mx-2 text-bone-muted">→</span>
          <span className="text-gold">{user.pendingName}</span>
        </p>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          disabled={loading}
          onClick={() => handle("approveName")}
          className="btn-gold px-3 py-1.5 text-xs disabled:opacity-60"
        >
          Approve
        </button>
        <button
          disabled={loading}
          onClick={() => handle("rejectName")}
          className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
