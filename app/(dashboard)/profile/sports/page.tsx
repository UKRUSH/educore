"use client";
// List sport achievements

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileSportsPage() {
  const [sports, setSports] = useState<{ id: string; sportName: string; type: string; place?: string | null; date: string; points: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/sports")
      .then((r) => r.ok ? r.json() : [])
      .then(setSports)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sports achievements</h1>
      {sports.length === 0 ? (
        <p className="text-muted-foreground">No sport achievements yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sports.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.sportName}</CardTitle>
                <p className="text-sm text-muted-foreground">{s.type}{s.place ? ` · ${s.place}` : ""}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleDateString()} · {s.points} pts
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
