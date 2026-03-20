"use client";
// List mentor sessions

import { useEffect, useState } from "react";
import { SessionCard } from "@/components/support/SessionCard";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<{
    id: string;
    title: string;
    description?: string | null;
    scheduledAt: string;
    capacity: number;
    meetLink?: string | null;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/sessions")
      .then((r) => (r.ok ? r.json() : []))
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sessions</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            id={s.id}
            title={s.title}
            description={s.description}
            scheduledAt={s.scheduledAt}
            capacity={s.capacity}
            meetLink={s.meetLink}
          />
        ))}
      </div>
      {sessions.length === 0 && <p className="text-muted-foreground">No sessions scheduled.</p>}
    </div>
  );
}
