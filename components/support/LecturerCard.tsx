"use client";
// Lecturer card for list

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LecturerCardProps {
  id: string;
  bio?: string | null;
  expertise: string[];
  isVerified: boolean;
  email?: string;
}

export function LecturerCard({
  bio,
  expertise,
  isVerified,
  email,
}: LecturerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {email ?? "Lecturer"}
          {isVerified && <Badge variant="success">Verified</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {bio && <p className="text-sm">{bio}</p>}
        <div className="flex flex-wrap gap-1">
          {expertise.map((e) => (
            <Badge key={e} variant="outline">{e}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
