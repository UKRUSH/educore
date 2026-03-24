"use client";
// Apply for session

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SessionApplyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/sessions/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Application failed");
        return;
      }
      router.push("/support/sessions");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Apply for session</h1>
      <Button onClick={handleApply} disabled={loading}>
        {loading ? "Applying…" : "Submit application"}
      </Button>
    </div>
  );
}
