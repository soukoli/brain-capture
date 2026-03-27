import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-xl">Brain Capture</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Capture. Organize. Execute.</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              A minimal task management system focused on mobile-first simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Quick Capture</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Capture tasks instantly with minimal friction
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Color-Coded Projects</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Organize with visual clarity using project colors
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Today&apos;s Focus</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select and complete today&apos;s most important tasks
              </p>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <p className="text-slate-600 dark:text-slate-400">
              Coming soon: A clean, mobile-first interface for managing your tasks
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
