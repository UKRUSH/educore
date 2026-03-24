"use client";
// List materials with pagination

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MaterialCard } from "@/components/materials/MaterialCard";

export default function MaterialsPage() {
  const [data, setData] = useState<{ data: { id: string; title: string; fileType: string; subject?: string | null; tags?: string[]; createdAt: string }[] } | null>(null);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Materials</h1>
        <Link href="/materials/upload">
          <Button>Upload</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((m) => (
          <MaterialCard
            key={m.id}
            id={m.id}
            title={m.title}
            fileType={m.fileType}
            subject={m.subject}
            tags={m.tags}
            createdAt={m.createdAt}
          />
        ))}
      </div>
      {materials.length === 0 && (
        <p className="text-muted-foreground">No materials yet. Upload one to get started.</p>
      )}
    </div>
  );
}
