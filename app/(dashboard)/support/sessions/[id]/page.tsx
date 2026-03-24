// Session detail with apply link

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date";

async function getSession(id: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/support/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession(id);
  if (!session) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{session.title}</h1>
      <p className="text-muted-foreground">{session.description ?? "No description."}</p>
      <p className="text-sm">
        {formatDateTime(session.scheduledAt)} · Capacity: {session.capacity}
      </p>
      {session.meetLink && (
        <a href={session.meetLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
          Join meeting
        </a>
      )}
      <Link href={`/support/sessions/${id}/apply`}>
        <Button>Apply for session</Button>
      </Link>
    </div>
  );
}
