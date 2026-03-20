"use client";
// Community feed — list posts and create post (calls /api/support/chat)

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityFeed } from "@/components/support/CommunityFeed";

export default function CommunityPage() {
  const [posts, setPosts] = useState<{ id: string; content: string; tags: string[]; createdAt: string }[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stub: no GET for community posts in spec; we only have POST /api/support/chat
    setPosts([]);
    setLoading(false);
  }, []);

  const handleCreate = async () => {
    if (!content.trim()) return;
    const res = await fetch("/api/support/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), tags: [] }),
    });
    if (res.ok) {
      const post = await res.json();
      setPosts((p) => [post, ...p]);
      setContent("");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Community</h1>
      <Card>
        <CardContent className="pt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            rows={3}
          />
          <Button className="mt-2" onClick={handleCreate} disabled={!content.trim()}>
            Post
          </Button>
        </CardContent>
      </Card>
      {loading ? <p className="text-muted-foreground">Loading...</p> : <CommunityFeed posts={posts} />}
    </div>
  );
}
