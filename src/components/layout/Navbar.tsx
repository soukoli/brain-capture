"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl">Brain Capture</span>
          </Link>

          {/* Navigation Links - To be added when new pages are implemented */}
          <div className="flex items-center gap-1">{/* Future navigation will go here */}</div>
        </div>
      </div>
    </nav>
  );
}
