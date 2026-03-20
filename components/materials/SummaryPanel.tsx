"use client";
// Displays material summary with "Generate Summary" and related resources

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SummaryPanelProps {
  summary: string | null;
  materialId: string;
  onGenerateSummary: () => void;
  isGenerating?: boolean;
  related?: { id: string; title: string; subject?: string | null }[];
}

export function SummaryPanel({
  summary,
  onGenerateSummary,
  isGenerating,
  related = [],
}: SummaryPanelProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Summary</CardTitle>
          <Button
            size="sm"
            onClick={onGenerateSummary}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating…" : "Generate Summary"}
          </Button>
        </CardHeader>
        <CardContent>
          {summary ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No summary yet. Click &quot;Generate Summary&quot; to add one (stub: you can paste text via API).
            </p>
          )}
        </CardContent>
      </Card>
      {related.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/materials/${r.id}`}
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    {r.title}
                    {r.subject && <Badge variant="outline">{r.subject}</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
