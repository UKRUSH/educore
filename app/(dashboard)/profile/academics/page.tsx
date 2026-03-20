"use client";
// List semesters and subjects; add semester/subject

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SubjectRow } from "@/components/profile/SubjectRow";

export default function AcademicsPage() {
  const [semesters, setSemesters] = useState<{ id: string; semesterNo: number; gpa: number; subjects: { code: string; name: string; credits: number; mark: number; grade: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/semesters")
      .then((r) => r.ok ? r.json() : [])
      .then(setSemesters)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Academics</h1>
      {semesters.map((s) => (
        <Card key={s.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Semester {s.semesterNo} — GPA: {s.gpa}</CardTitle>
            <Link href={`/profile/semesters/${s.id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4 text-right">Credits</th>
                  <th className="py-2 pr-4 text-right">Mark</th>
                  <th className="py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {s.subjects?.map((sub: { id?: string; code: string; name: string; credits: number; mark: number; grade: string }) => (
                  <SubjectRow
                    key={sub.id ?? sub.code + sub.name}
                    code={sub.code}
                    name={sub.name}
                    credits={sub.credits}
                    mark={sub.mark}
                    grade={sub.grade}
                  />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
