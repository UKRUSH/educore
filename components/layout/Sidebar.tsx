"use client";
// Dashboard sidebar navigation

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/materials", label: "Materials" },
  { href: "/clubs", label: "Clubs" },
  { href: "/support/lecturers", label: "Support" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r bg-card min-h-screen p-4 flex flex-col">
      <Link href="/" className="font-bold text-lg mb-6 text-primary">
        Educore
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
