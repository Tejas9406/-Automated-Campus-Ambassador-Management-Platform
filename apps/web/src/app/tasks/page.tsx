"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, Plus, Timer } from "lucide-react";
import * as React from "react";

import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createTask, listTasks, updateTask, type Task } from "@/lib/api";

function statusIcon(status: Task["status"]) {
  if (status === "done") return <CheckCircle2 className="h-4 w-4 text-cyan-300" />;
  if (status === "doing") return <Timer className="h-4 w-4 text-cyan-300" />;
  return <Circle className="h-4 w-4 text-slate-400" />;
}

export default function TasksPage() {
  const [username, setUsername] = React.useState("octocat");
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [items, setItems] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await listTasks(username.trim() || undefined);
      setItems(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    if (!username.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await createTask({
        ambassador_username: username.trim(),
        title: title.trim(),
        description: desc.trim() || undefined,
      });
      setTitle("");
      setDesc("");
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(task: Task, status: Task["status"]) {
    await updateTask(task.id, { status });
    await refresh();
  }

  const todo = items.filter((t) => t.status === "todo");
  const doing = items.filter((t) => t.status === "doing");
  const done = items.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,211,238,0.12),rgba(2,6,23,0)_70%)]">
      <Topbar />
      <main className="py-10">
        <Container>
          <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div className="w-full lg:max-w-xl space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                Smart Tasks
              </h1>
              <p className="text-sm text-slate-300">
                Create growth tasks and move them across stages. Leaderboard
                points update from GitHub score + completion.
              </p>

              <div className="rounded-3xl bg-white/5 p-5 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
                <div className="grid gap-2">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 rounded-xl bg-slate-950/50 px-3 text-sm text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    placeholder="Ambassador username"
                  />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 rounded-xl bg-slate-950/50 px-3 text-sm text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    placeholder='Task title (e.g. "Improve README of Project X")'
                  />
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="min-h-24 rounded-xl bg-slate-950/50 px-3 py-2 text-sm text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    placeholder="Optional details"
                  />
                  <div className="flex gap-2">
                    <Button onClick={add} disabled={saving || !title.trim()}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Add task
                    </Button>
                    <Button variant="ghost" onClick={refresh} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Refresh"
                      )}
                    </Button>
                  </div>
                </div>

                {error ? (
                  <div className="mt-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_0_0_1px_rgba(248,113,113,0.25)]">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <div className="grid gap-4 lg:grid-cols-3">
                {[{ k: "todo", label: "To do", items: todo }, { k: "doing", label: "Doing", items: doing }, { k: "done", label: "Done", items: done }].map(
                  (col) => (
                    <div
                      key={col.k}
                      className="rounded-3xl bg-gradient-to-b from-white/8 to-white/3 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.18)]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-100">
                          {col.label}
                        </div>
                        <div className="text-xs text-slate-400">
                          {col.items.length}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {col.items.map((t) => (
                          <motion.div
                            key={t.id}
                            layout
                            className="rounded-2xl bg-slate-950/50 p-4 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-slate-100">
                                  {t.title}
                                </div>
                                {t.description ? (
                                  <div className="text-xs text-slate-400">
                                    {t.description}
                                  </div>
                                ) : null}
                              </div>
                              <div className="mt-0.5">{statusIcon(t.status)}</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {t.status !== "todo" ? (
                                <button
                                  onClick={() => setStatus(t, "todo")}
                                  className="rounded-xl bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/7"
                                >
                                  To do
                                </button>
                              ) : null}
                              {t.status !== "doing" ? (
                                <button
                                  onClick={() => setStatus(t, "doing")}
                                  className="rounded-xl bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/7"
                                >
                                  Doing
                                </button>
                              ) : null}
                              {t.status !== "done" ? (
                                <button
                                  onClick={() => setStatus(t, "done")}
                                  className="rounded-xl bg-cyan-400/15 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-400/20"
                                >
                                  Done
                                </button>
                              ) : null}
                            </div>
                          </motion.div>
                        ))}
                        {col.items.length === 0 ? (
                          <div className="rounded-2xl bg-white/3 px-4 py-6 text-sm text-slate-400">
                            No tasks yet.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

