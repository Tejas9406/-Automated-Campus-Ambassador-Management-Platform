"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]">
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-100">
                CampusConnect
              </div>
              <div className="text-xs text-slate-400">Recruiter-ready growth</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden sm:flex items-center gap-2 text-xs text-slate-400"
            >
              <span className="rounded-full bg-white/5 px-3 py-1">
                GitHub Pulse
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1">
                Tasks
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1">
                Leaderboard
              </span>
            </motion.div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isDark ? "Light" : "Dark"}
              </span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

