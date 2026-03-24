"use client";
// Register as lecturer (bio, expertise)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LecturerRegisterPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support/lecturers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio.trim() || undefined,
          expertise: expertise ? expertise.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Registration failed");
        return;
      }
      router.push("/support/lecturers");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Register as lecturer</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lecturer profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              Bio
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </label>
            <label className="block text-sm font-medium">
              Expertise (comma-separated)
              <Input
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g. Math, Physics"
                className="mt-1"
              />
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
