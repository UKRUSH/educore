"use client";
// Club card for directory grid

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  capacity: number;
  memberCount: number;
}

export function ClubCard(props: ClubCardProps) {
  const { id, name, description, category, capacity, memberCount } = props;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
        <Badge variant="secondary">{category}</Badge>
        <p className="text-sm text-muted-foreground">
          {memberCount} / {capacity} members
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {description && <p className="text-sm line-clamp-2">{description}</p>}
        <Link href={"/clubs/" + id + "/apply"}>
          <Button size="sm">Apply</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
