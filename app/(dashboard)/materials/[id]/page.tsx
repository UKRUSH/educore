"use client";
// Material detail with summary panel and related resources

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryPanel } from "@/components/materials/SummaryPanel";

export default function MaterialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [material, setMaterial] = useState<{
    id: string;
    title: string;
    description?: string | null;
    fileUrl: string;
    fileType: string;
    subject?: string | null;
    summary?: string | null;
    tags?: string[];
  } | null>(null);
  const [related, setRelated] = useState<{ id: string; title: string; subject?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/materials/" + id)
      .then((r) => (r.ok ? r.json() : null))
      .then(setMaterial)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch("/api/materials/" + id + "/suggest")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRelated);
  }, [id]);

  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/materials/" + id + "/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: "Summary placeholder. Integrate with an AI API for real summaries." }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMaterial((m) => (m ? { ...m, summary: updated.summary } : null));
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !material) {
    return <p className="text-muted-foreground">{material === null && !loading ? "Not found" : "Loading…"}</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Link href="/materials" className="text-sm text-muted-foreground hover:underline">
          Materials
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{material.title}</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{material.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {material.fileType} {material.subject ? " · " + material.subject : ""}
          </p>
          {material.description && <p className="text-sm">{material.description}</p>}
          <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
            Open file
          </a>
        </CardHeader>
      </Card>
      <SummaryPanel
        summary={material.summary ?? null}
        materialId={id}
        onGenerateSummary={handleGenerateSummary}
        isGenerating={generating}
        related={related}
      />
    </div>
  );
}
