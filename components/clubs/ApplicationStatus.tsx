"use client";
// Shows status badge for a club application

import { Badge } from "@/components/ui/badge";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface ApplicationStatusProps {
  status: Status;
  feedback?: string | null;
}

export function ApplicationStatus({ status, feedback }: ApplicationStatusProps) {
  const variant =
    status === "APPROVED" ? "success" : status === "REJECTED" ? "destructive" : "secondary";
  return (
    <div className="space-y-1">
      <Badge variant={variant}>{status}</Badge>
      {status === "REJECTED" && feedback && (
        <p className="text-sm text-muted-foreground">{feedback}</p>
      )}
    </div>
  );
}
