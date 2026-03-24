"use client";
// Upload material form

import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/materials/UploadZone";

export default function MaterialsUploadPage() {
  const router = useRouter();

  const handleUpload = async (data: { title: string; fileUrl: string; fileType: string; description?: string; subject?: string; tags?: string[] }) => {
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Upload failed");
      return;
    }
    const material = await res.json();
    router.push(`/materials/${material.id}`);
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Upload material</h1>
      <UploadZone onUpload={handleUpload} />
    </div>
  );
}
