"use client";
// Profile overview — fetches /api/profile/me and shows ProfileCard

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    name: string;
    faculty: string;
    degree: string;
    intakeYear: number;
    bio?: string | null;
    scores?: { academic: number; sports: number; society: number; overall: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link href="/profile/setup">
          <Button variant="outline">Edit setup</Button>
        </Link>
      </div>
      <ProfileCard
        name={profile.name}
        faculty={profile.faculty}
        degree={profile.degree}
        intakeYear={profile.intakeYear}
        bio={profile.bio}
        scores={profile.scores}
      />
      <div className="flex flex-wrap gap-2">
        <Link href="/profile/academics">
          <Button variant="outline">Academics</Button>
        </Link>
        <Link href="/profile/clubs">
          <Button variant="outline">Clubs</Button>
        </Link>
        <Link href="/profile/sports">
          <Button variant="outline">Sports</Button>
        </Link>
        <Link href="/profile/skill-points">
          <Button variant="outline">Skill points</Button>
        </Link>
        <Link href="/profile/progress">
          <Button>Progress</Button>
        </Link>
      </div>
    </div>
  );
}
