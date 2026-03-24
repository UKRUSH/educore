"use client";
// List student's club memberships

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileClubsPage() {
  const [clubs, setClubs] = useState<{ id: string; club: { name: string; category: string }; role: string; joinedDate: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/clubs")
      .then((r) => r.ok ? r.json() : [])
      .then(setClubs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My clubs</h1>
      {clubs.length === 0 ? (
        <p className="text-muted-foreground">You have not joined any clubs yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clubs.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{m.club.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{m.club.category} · {m.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(m.joinedDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
