"use client";
// Session card with apply link

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date";

interface SessionCardProps {
  id: string;
  title: string;
  description?: string | null;
  scheduledAt: string | Date;
  capacity: number;
  meetLink?: string | null;
}

export function SessionCard({
  id,
  title,
  description,
  scheduledAt,
  capacity,
  meetLink,
}: SessionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(scheduledAt)} · Capacity: {capacity}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {description && <p className="text-sm">{description}</p>}
        {meetLink && (
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Join meeting
          </a>
        )}
        <Link href={`/support/sessions/${id}/apply`}>
          <Button size="sm">Apply</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
