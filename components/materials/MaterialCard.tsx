"use client";
// Card for a single material in list view

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MaterialCardProps {
  id: string;
  title: string;
  fileType: string;
  subject?: string | null;
  tags?: string[];
  createdAt?: string;
}

export function MaterialCard({
  id,
  title,
  fileType,
  subject,
  tags = [],
  createdAt,
}: MaterialCardProps) {
  return (
    <Link href={`/materials/${id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{fileType}</Badge>
            {subject && <Badge variant="secondary">{subject}</Badge>}
            {tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </CardHeader>
        {createdAt && (
          <CardContent className="pt-0 text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
