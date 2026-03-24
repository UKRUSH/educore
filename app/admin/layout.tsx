// Admin layout — sidebar with admin links (middleware enforces ADMIN role)

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-56 border-r bg-card p-4">
          <Link href="/admin" className="font-bold text-lg text-primary block mb-6">
            Admin
          </Link>
          <nav className="flex flex-col gap-1">
            <Link href="/admin" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Overview
            </Link>
            <Link href="/admin/clubs" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Clubs
            </Link>
            <Link href="/admin/club-applications" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Club applications
            </Link>
            <Link href="/admin/materials" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Materials
            </Link>
            <Link href="/admin/lecturers" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Lecturers
            </Link>
            <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
