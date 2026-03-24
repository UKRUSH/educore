"use client";
// Progress: GPA line chart, Academic/Sports/Society bar chart, suggestions list

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScoreChart, GPALineChart } from "@/components/profile/ScoreChart";

export default function ProgressPage() {
  const [profile, setProfile] = useState<{
    semesters?: { semesterNo: number; gpa: number }[];
    scores?: { academic: number; sports: number; society: number; overall: number };
  } | null>(null);
  const [suggestions, setSuggestions] = useState<{ type: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile/me").then((r) => r.ok ? r.json() : null),
      fetch("/api/profile/suggestions").then((r) => r.ok ? r.json() : []),
    ]).then(([p, s]) => {
      setProfile(p ?? null);
      setSuggestions(s ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const scores = profile?.scores ?? { academic: 0, sports: 0, society: 0, overall: 0 };
  const semesters = profile?.semesters ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress</h1>
        <Link href="/profile/skill-points" className="text-sm text-primary hover:underline">
          Skill points
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GPA per semester</CardTitle>
        </CardHeader>
        <CardContent>
          {semesters.length > 0 ? (
            <GPALineChart data={semesters.map((s) => ({ semesterNo: s.semesterNo, gpa: s.gpa }))} />
          ) : (
            <p className="text-sm text-muted-foreground">Add semesters in Academics to see your GPA trend.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreChart academic={scores.academic} sports={scores.sports} society={scores.society} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="font-medium text-muted-foreground shrink-0">[{s.type}]</span>
                <span>{s.message}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
