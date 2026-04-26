export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export type GitHubPulse = {
  username: string;
  score: number;
  recruiter_tips: string[];
  top_repos: Array<{
    name: string;
    full_name: string;
    html_url: string;
    description?: string | null;
    language?: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    updated_at?: string | null;
  }>;
  generated_by: "gemini" | "heuristic";
};

export type Task = {
  id: string;
  ambassador_username: string;
  title: string;
  description?: string | null;
  status: "todo" | "doing" | "done";
  created_at: string;
  updated_at: string;
};

export type Leaderboard = {
  updated_at: string;
  entries: Array<{
    ambassador_username: string;
    github_score: number;
    tasks_done: number;
    tasks_total: number;
    points: number;
  }>;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export function getPulse(username: string) {
  const q = new URLSearchParams({ username });
  return apiFetch<GitHubPulse>(`/github/pulse?${q.toString()}`);
}

export function listTasks(ambassador_username?: string) {
  const q = ambassador_username ? `?${new URLSearchParams({ ambassador_username })}` : "";
  return apiFetch<Task[]>(`/tasks${q}`);
}

export function createTask(body: {
  ambassador_username: string;
  title: string;
  description?: string;
}) {
  return apiFetch<Task>(`/tasks`, { method: "POST", body: JSON.stringify(body) });
}

export function updateTask(task_id: string, body: Partial<Pick<Task, "status" | "title" | "description">>) {
  return apiFetch<Task>(`/tasks/${task_id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function getLeaderboard() {
  return apiFetch<Leaderboard>(`/leaderboard`);
}

