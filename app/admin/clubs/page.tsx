"use client";
// Admin: list clubs (read-only for now; create via API)

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<{ id: string; name: string; category: string; capacity: number; memberCount?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clubs")
      .then((r) => r.ok ? r.json() : [])
      .then((list: { id: string; name: string; category: string; capacity: number; _count?: { members: number }; memberCount?: number }[]) =>
        list.map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          capacity: c.capacity,
          memberCount: c.memberCount ?? c._count?.members ?? 0,
        }))
      )
      .then(setClubs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clubs</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {clubs.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{c.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{c.category} · {c.memberCount ?? 0} / {c.capacity}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
      {clubs.length === 0 && <p className="text-muted-foreground">No clubs.</p>}
    </div>
  );
}
