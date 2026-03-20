// Public site footer

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-4">
        <div>
          <Link href="/" className="font-semibold text-primary">
            Educore
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            University student platform
          </p>
        </div>
        <div className="flex gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
