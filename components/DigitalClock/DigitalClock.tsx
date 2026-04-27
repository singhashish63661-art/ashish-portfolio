"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formatDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="inline-flex max-w-full cursor-default items-center gap-3 rounded-2xl border border-violet-200/80 bg-white/95 px-4 py-3 shadow-[0_8px_30px_-8px_rgba(124,58,237,0.2)] backdrop-blur-md dark:border-violet-500/20 dark:bg-zinc-900/90 dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] sm:gap-4 sm:rounded-full sm:px-5 sm:py-3"
      role="status"
      aria-live="polite"
      aria-label="Current local time"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-md shadow-violet-600/25 sm:h-12 sm:w-12 sm:rounded-full">
        <Clock className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
        </span>
      </div>

      <div className="min-w-0 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600/90 dark:text-violet-400/90">
          Local time
        </p>
        <div className="mt-0.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
          <span
            suppressHydrationWarning
            className="font-mono text-lg font-bold tabular-nums tracking-wide text-gray-900 dark:text-white sm:text-xl"
          >
            {formatTime}
          </span>
          <span
            suppressHydrationWarning
            className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:border-l sm:border-violet-200 sm:pl-3 dark:sm:border-violet-500/30"
          >
            {formatDate}
          </span>
        </div>
      </div>
    </div>
  );
}
