// Pricing page

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
          Educore
        </Link>
        <nav className="flex gap-4">
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-medium underline">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Pricing</h1>
        <p className="text-muted-foreground mb-6">
          Educore is free for university students. Get started today.
        </p>
        <Link href="/register">
          <Button>Get started free</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
