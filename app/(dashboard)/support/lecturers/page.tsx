"use client";
// List verified lecturers and link to register as lecturer

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LecturerCard } from "@/components/support/LecturerCard";

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<{ id: string; bio?: string | null; expertise: string[]; isVerified: boolean; user?: { email: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/lecturers")
      .then((r) => r.ok ? r.json() : [])
      .then(setLecturers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Lecturers</h1>
        <div className="flex gap-2">
          <Link href="/support/sessions">
            <Button variant="ghost">Sessions</Button>
          </Link>
          <Link href="/support/community">
            <Button variant="ghost">Community</Button>
          </Link>
          <Link href="/support/lecturers/register">
            <Button variant="outline">Register as lecturer</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lecturers.map((m) => (
          <LecturerCard
            key={m.id}
            id={m.id}
            bio={m.bio}
            expertise={m.expertise}
            isVerified={m.isVerified}
            email={m.user?.email}
          />
        ))}
      </div>
      {lecturers.length === 0 && <p className="text-muted-foreground">No verified lecturers yet.</p>}
    </div>
  );
}
