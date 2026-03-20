"use client";
// Apply to club form

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApplyForm } from "@/components/clubs/ApplyForm";

export default function ClubApplyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [club, setClub] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/clubs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setClub)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (reason?: string) => {
    const res = await fetch(`/api/clubs/${id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Application failed");
      return;
    }
    router.push("/clubs");
    router.refresh();
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!club) return <p className="text-muted-foreground">Club not found.</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Apply to club</h1>
      <ApplyForm clubName={club.name} onSubmit={handleSubmit} />
    </div>
  );
}
