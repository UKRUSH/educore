"use client";
// Community feed of posts with optional create form

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/date";

interface Post {
  id: string;
  content: string;
  tags: string[];
  createdAt: string | Date;
}

interface CommunityFeedProps {
  posts: Post[];
  onCreatePost?: (content: string, tags?: string[]) => Promise<void>;
}

export function CommunityFeed({ posts }: CommunityFeedProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-6">
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {post.tags.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDateTime(post.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
