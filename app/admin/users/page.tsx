"use client";
// Admin: create and manage users (lecturers, admins, students)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "LECTURER" | "ADMIN">("LECTURER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create user");
        setLoading(false);
        return;
      }

      setSuccess(`${role} account created successfully for ${email}`);
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create lecturer or admin accounts. Students register themselves.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <label className="block text-sm font-medium">
              Email
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                minLength={6}
              />
            </label>

            <label className="block text-sm font-medium">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "STUDENT" | "LECTURER" | "ADMIN")}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              >
                <option value="LECTURER">Lecturer</option>
                <option value="ADMIN">Admin</option>
                <option value="STUDENT">Student</option>
              </select>
            </label>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
