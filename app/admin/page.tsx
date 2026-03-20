// Admin overview

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/clubs">
          <Button variant="outline">Manage clubs</Button>
        </Link>
        <Link href="/admin/club-applications">
          <Button variant="outline">Club applications</Button>
        </Link>
        <Link href="/admin/materials">
          <Button variant="outline">Materials</Button>
        </Link>
        <Link href="/admin/lecturers">
          <Button variant="outline">Lecturers</Button>
        </Link>
      </div>
    </div>
  );
}
