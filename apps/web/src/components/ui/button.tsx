"use client";

import * as React from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
) {
  const { className, variant = "primary", size = "md", ...rest } = props;
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
        "disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm",
        variant === "primary" &&
          "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]",
        variant === "ghost" &&
          "bg-transparent text-slate-200 hover:bg-white/5 shadow-[0_0_0_1px_rgba(148,163,184,0.2)]",
        className
      )}
      {...rest}
    />
  );
}

