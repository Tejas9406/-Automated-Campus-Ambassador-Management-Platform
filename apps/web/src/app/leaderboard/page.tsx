"use client";

import { motion } from "framer-motion";
import { Crown, RefreshCw, Trophy } from "lucide-react";
import * as React from "react";

import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getLeaderboard, type Leaderboard } from "@/lib/api";

function medal(i: number) {
  if (i === 0) return "text-yellow-300";
  if (i === 1) return "text-slate-200";
  if (i === 2) return "text-orange-300";
  return "text-slate-500";
}

export default function LeaderboardPage() {
  const [data, setData] = React.useState<Leaderboard | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await getLeaderboard());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.12),rgba(2,6,23,0)_70%)]">
      <Topbar />
      <main className="py-10">
        <Container>
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Ambassador Leaderboard
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Ranked by GitHub strength + task completion.
              </p>
            </div>
            <Button variant="ghost" onClick={load} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_0_0_1px_rgba(248,113,113,0.25)]">
              {error}
            </div>
          ) : null}

          <div className="mt-6 rounded-3xl bg-gradient-to-b from-white/8 to-white/3 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.18)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Ambassador</th>
                    <th className="px-4 py-2">GitHub Score</th>
                    <th className="px-4 py-2">Tasks Done</th>
                    <th className="px-4 py-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.entries || []).map((e, i) => (
                    <motion.tr
                      key={e.ambassador_username}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="rounded-2xl bg-slate-950/50 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]"
                    >
                      <td className="px-4 py-3 text-sm text-slate-200">
                        <span className={`inline-flex items-center gap-2 ${medal(i)}`}>
                          {i < 3 ? <Trophy className="h-4 w-4" /> : null}
                          #{i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-100">
                        <span className="inline-flex items-center gap-2">
                          {i === 0 ? (
                            <Crown className="h-4 w-4 text-cyan-300" />
                          ) : null}
                          {e.ambassador_username}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">
                        {e.github_score}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">
                        {e.tasks_done}/{e.tasks_total}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-cyan-200">
                        {e.points}
                      </td>
                    </motion.tr>
                  ))}
                  {(data?.entries?.length || 0) === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                        No entries yet. Run GitHub Pulse for a username to populate the leaderboard.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

