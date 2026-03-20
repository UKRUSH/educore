"use client";
// Skill points / scores breakdown: how each score is calculated and current values

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreChart } from "@/components/profile/ScoreChart";

export default function SkillPointsPage() {
  const [profile, setProfile] = useState<{
    scores?: {
      academic: number;
      sports: number;
      society: number;
      overall: number;
      rawSportPoints?: number;
      rawClubPoints?: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const scores = profile?.scores ?? {
    academic: 0,
    sports: 0,
    society: 0,
    overall: 0,
    rawSportPoints: 0,
    rawClubPoints: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Skill points</h1>
        <Link href="/profile">
          <Button variant="outline">Back to profile</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your scores (0–100)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Overall = 60% Academic + 20% Sports + 20% Society
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">Academic</p>
              <p className="text-2xl font-bold">{scores.academic}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Average of all subject marks
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">Sports</p>
              <p className="text-2xl font-bold">{scores.sports}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {scores.rawSportPoints ?? 0} points (capped at 100)
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">Society</p>
              <p className="text-2xl font-bold">{scores.society}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {scores.rawClubPoints ?? 0} points (capped at 100)
              </p>
            </div>
            <div className="rounded-lg border bg-primary/10 p-4">
              <p className="text-sm font-medium text-muted-foreground">Overall</p>
              <p className="text-2xl font-bold">{scores.overall}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                60% · 20% · 20%
              </p>
            </div>
          </div>
          <ScoreChart
            academic={scores.academic}
            sports={scores.sports}
            society={scores.society}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How skill points work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Academic score:</strong> Average of all your subject marks (0–100) across semesters.
          </p>
          <p>
            <strong className="text-foreground">Sports score:</strong> Sum of points from your sport achievements (each achievement has points). Capped at 100.
          </p>
          <p>
            <strong className="text-foreground">Society score:</strong> Sum of points from your club memberships. Capped at 100.
          </p>
          <p>
            <strong className="text-foreground">Overall:</strong> (Academic × 0.6) + (Sports × 0.2) + (Society × 0.2).
          </p>
          <div className="pt-2">
            <Link href="/profile/progress" className="text-primary hover:underline">
              View progress & suggestions →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
