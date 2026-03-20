"use client";
// Top bar with user info and logout

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "LECTURER":
        return "Lecturer";
      case "STUDENT":
        return "Student";
      default:
        return "User";
    }
  };

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
      <div className="text-sm">
        <p className="font-medium">{session?.user?.email ?? "Guest"}</p>
        <p className="text-xs text-muted-foreground">
          {getRoleLabel(session?.user?.role as string)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-sm font-medium hover:underline">
          Profile
        </Link>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
