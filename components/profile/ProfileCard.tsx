"use client";
// Displays student profile summary with scores

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  name: string;
  faculty: string;
  degree: string;
  intakeYear: number;
  bio?: string | null;
  scores?: { academic: number; sports: number; society: number; overall: number };
}

export function ProfileCard({
  name,
  faculty,
  degree,
  intakeYear,
  bio,
  scores,
}: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {faculty} · {degree} · Intake {intakeYear}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {bio && <p className="text-sm">{bio}</p>}
        {scores && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Academic: {scores.academic}</Badge>
            <Badge variant="secondary">Sports: {scores.sports}</Badge>
            <Badge variant="secondary">Society: {scores.society}</Badge>
            <Badge>Overall: {scores.overall}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
