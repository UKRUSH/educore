"use client";
// Club directory grid with Apply button

import { useEffect, useState } from "react";
import { ClubCard } from "@/components/clubs/ClubCard";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<{ id: string; name: string; description?: string | null; category: string; capacity: number; memberCount?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clubs")
      .then((r) => r.ok ? r.json() : [])
      .then((list) => list.map((c: { _count?: { members: number }; memberCount?: number }) => ({
        ...c,
        memberCount: c.memberCount ?? c._count?.members ?? 0,
      })))
      .then(setClubs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clubs</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c) => (
          <ClubCard
            key={c.id}
            id={c.id}
            name={c.name}
            description={c.description}
            category={c.category}
            capacity={c.capacity}
            memberCount={c.memberCount ?? 0}
          />
        ))}
      </div>
      {clubs.length === 0 && <p className="text-muted-foreground">No clubs yet.</p>}
    </div>
  );
}
