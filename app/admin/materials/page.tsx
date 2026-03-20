"use client";
// Admin: list materials

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMaterialsPage() {
  const [data, setData] = useState<{ data: { id: string; title: string; fileType: string; createdAt: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.ok ? r.json() : { data: [] })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  const materials = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Materials</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {materials.map((m) => (
          <Card key={m.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{m.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{m.fileType} · {new Date(m.createdAt).toLocaleDateString()}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
      {materials.length === 0 && <p className="text-muted-foreground">No materials.</p>}
    </div>
  );
}
