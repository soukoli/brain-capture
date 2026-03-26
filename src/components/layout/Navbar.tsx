"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl">Brain Capture</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/capture">
              <Button
                variant={isActive("/capture") ? "default" : "ghost"}
                size="sm"
              >
                Capture
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
