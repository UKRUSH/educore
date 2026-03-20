"use client";
// Drag-and-drop or click upload zone (accepts file URL input for stub)

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadZoneProps {
  onUpload: (data: { title: string; fileUrl: string; fileType: string; description?: string; subject?: string; tags?: string[] }) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "doc" | "ppt">("pdf");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;
    onUpload({
      title: title.trim(),
      fileUrl: fileUrl.trim(),
      fileType,
      description: description.trim() || undefined,
      subject: subject.trim() || undefined,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Title
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Material title"
              className="mt-1"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            File URL
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            File type
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as "pdf" | "doc" | "ppt")}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="pdf">PDF</option>
              <option value="doc">DOC</option>
              <option value="ppt">PPT</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Description (optional)
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="mt-1"
            />
          </label>
          <label className="block text-sm font-medium">
            Subject (optional)
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. CS101"
              className="mt-1"
            />
          </label>
          <label className="block text-sm font-medium">
            Tags (comma-separated, optional)
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="math, algebra"
              className="mt-1"
            />
          </label>
          <Button type="submit">Upload</Button>
        </form>
      </CardContent>
    </Card>
  );
}
