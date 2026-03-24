"use client";
// Admin: table of pending club applications with Approve / Reject; rejection shows feedback input

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApplicationStatus } from "@/components/clubs/ApplicationStatus";
import { Modal } from "@/components/ui/modal";

interface App {
  id: string;
  applicantId: string;
  clubId: string;
  club: { name: string };
  status: string;
  reason: string | null;
  feedback: string | null;
  appliedAt: string;
}

export default function AdminClubApplicationsPage() {
  const [applications, setApplications] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const load = () => {
    fetch("/api/clubs/applications")
      .then((r) => (r.ok ? r.json() : []))
      .then(setApplications)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (applicationId: string) => {
    const res = await fetch("/api/clubs/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status: "APPROVED" }),
    });
    if (res.ok) load();
  };

  const handleReject = async (applicationId: string) => {
    const res = await fetch("/api/clubs/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status: "REJECTED", feedback }),
    });
    if (res.ok) {
      setRejecting(null);
      setFeedback("");
      load();
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Club applications</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 pr-4">Club</th>
              <th className="py-2 pr-4">Applicant ID</th>
              <th className="py-2 pr-4">Reason</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b">
                <td className="py-2 pr-4">{app.club.name}</td>
                <td className="py-2 pr-4 font-mono text-xs">{app.applicantId}</td>
                <td className="py-2 pr-4">{app.reason ?? "—"}</td>
                <td className="py-2 pr-4">
                  <ApplicationStatus status={app.status as "PENDING" | "APPROVED" | "REJECTED"} feedback={app.feedback} />
                </td>
                <td className="py-2">
                  {app.status === "PENDING" && (
                    <>
                      <Button size="sm" className="mr-2" onClick={() => handleApprove(app.id)}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRejecting(app.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && <p className="text-muted-foreground">No applications.</p>}

      <Modal
        open={rejecting !== null}
        onClose={() => { setRejecting(null); setFeedback(""); }}
        title="Reject application"
      >
        <label className="block text-sm font-medium mb-2">
          Feedback (optional)
          <Input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Reason for rejection"
            className="mt-1"
          />
        </label>
        <div className="flex gap-2 mt-4">
          <Button variant="destructive" onClick={() => rejecting && handleReject(rejecting)}>
            Confirm reject
          </Button>
          <Button variant="outline" onClick={() => { setRejecting(null); setFeedback(""); }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
