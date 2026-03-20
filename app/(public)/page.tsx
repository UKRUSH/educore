// Landing page for Educore

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
          Educore
        </Link>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Educore</h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Your university student platform: profile, materials, clubs, and mentor support.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg">Sign up</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
