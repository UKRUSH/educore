// Club detail — redirect to apply or show info

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getClub(id: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/clubs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const club = await getClub(id);
  if (!club) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{club.name}</h1>
      <p className="text-muted-foreground">{club.description ?? "No description."}</p>
      <p className="text-sm">
        {club.memberCount ?? 0} / {club.capacity} members · {club.category}
      </p>
      <Link href={`/clubs/${id}/apply`}>
        <Button>Apply to join</Button>
      </Link>
    </div>
  );
}
