"use client";
// Admin: list lecturers (verified and unverified)

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminLecturersPage() {
  const [lecturers, setLecturers] = useState<{ id: string; bio?: string | null; expertise: string[]; isVerified: boolean; user?: { email: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/lecturers")
      .then((r) => r.ok ? r.json() : [])
      .then(setLecturers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lecturers</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {lecturers.map((m) => (
          <Card key={m.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {m.user?.email ?? "—"}
                {m.isVerified && <Badge variant="success">Verified</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{m.bio ?? "No bio"}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {m.expertise.map((e) => (
                  <Badge key={e} variant="outline">{e}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {lecturers.length === 0 && <p className="text-muted-foreground">No lecturers.</p>}
    </div>
  );
}
