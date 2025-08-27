"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="mx-auto max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">shadcn/ui is working</h1>
      <p className="text-muted-foreground">
        Next.js 15.5 + Tailwind CSS + shadcn/ui
      </p>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <Button onClick={() => setCount((c) => c + 1)}>Click me</Button>
          <span className="text-sm">Count: {count}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Link href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
            <Button variant="link">Docs</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
