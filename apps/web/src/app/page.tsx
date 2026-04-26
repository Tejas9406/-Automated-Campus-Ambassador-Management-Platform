import { Topbar } from "@/components/topbar";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.18),rgba(2,6,23,0)_70%)]">
      <Topbar />
      <main className="py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                UnsaidTalks Hackathon Build
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                Recruiter-ready ambassadors, measured in real outcomes.
              </h1>
              <p className="text-pretty text-base leading-7 text-slate-300">
                CampusConnect centralizes ambassador management and upgrades every
                profile with GitHub Pulse—an AI recruiter score + growth tasks
                that compound.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <a
                  href="/pulse"
                  className="rounded-2xl bg-white/5 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.15)] hover:bg-white/7 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-100">
                    GitHub Pulse
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Score + 3 tips
                  </div>
                </a>
                <a
                  href="/tasks"
                  className="rounded-2xl bg-white/5 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.15)] hover:bg-white/7 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-100">
                    Growth Tasks
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Track progress
                  </div>
                </a>
                <a
                  href="/leaderboard"
                  className="rounded-2xl bg-white/5 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.15)] hover:bg-white/7 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-100">
                    Leaderboard
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Real-time rank
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-white/8 to-white/3 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.18)]">
              <div className="rounded-2xl bg-slate-950/60 p-5 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]">
                <div className="text-xs font-medium text-slate-400">
                  Recruiter-Ready Score
                </div>
                <div className="mt-2 flex items-end gap-3">
                  <div className="text-5xl font-semibold tracking-tight text-cyan-300">
                    72
                  </div>
                  <div className="pb-1 text-sm text-slate-300">
                    + 3 actionable upgrades
                  </div>
                </div>
                <div className="mt-5 space-y-2 text-sm text-slate-300">
                  <div className="rounded-xl bg-white/5 px-3 py-2">
                    Add demo GIF + quickstart to top repos.
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2">
                    Pin 3 projects that show ownership.
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2">
                    Add impact metrics (users, time saved, latency).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
