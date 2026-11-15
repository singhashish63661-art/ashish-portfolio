"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Download, RefreshCcw, Trash2 } from "lucide-react";
import HardLink from "@/components/HardLink/HardLink";
import {
  clearStoredAnalyticsEvents,
  getStoredAnalyticsEvents,
  type StoredAnalyticsEvent,
} from "@/lib/analytics";

type EventCount = {
  event: string;
  count: number;
};

type DateRange = "today" | "7d" | "30d" | "all";

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function getFilteredEvents(events: StoredAnalyticsEvent[], range: DateRange) {
  if (range === "all") return events;

  const now = new Date();
  const threshold =
    range === "today"
      ? startOfToday()
      : new Date(now.getTime() - (range === "7d" ? 7 : 30) * 24 * 60 * 60 * 1000);

  return events.filter((event) => new Date(event.timestamp) >= threshold);
}

function getEventCounts(events: StoredAnalyticsEvent[]): EventCount[] {
  const counts = new Map<string, number>();
  for (const item of events) {
    counts.set(item.event, (counts.get(item.event) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count);
}

function getTopProjectClicks(events: StoredAnalyticsEvent[]) {
  const counts = new Map<string, number>();
  for (const item of events) {
    const slug = item.payload.project_slug;
    if ((item.event === "project_case_study_click" || item.event === "project_live_link_click") && typeof slug === "string") {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getContactFunnel(events: StoredAnalyticsEvent[]) {
  let submits = 0;
  let tabChanges = 0;

  for (const item of events) {
    if (item.event === "contact_submit_success") submits += 1;
    if (item.event === "portfolio_tab_change") tabChanges += 1;
  }

  return {
    steps: [
      { label: "Contact form — sent", count: submits },
      { label: "Portfolio tab changes", count: tabChanges },
    ],
  };
}

export default function AnalyticsPage() {
  const [allEvents, setAllEvents] = useState<StoredAnalyticsEvent[]>(() => getStoredAnalyticsEvents());
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const events = useMemo(() => getFilteredEvents(allEvents, dateRange), [allEvents, dateRange]);
  const summary = useMemo(() => getEventCounts(events), [events]);
  const topProjects = useMemo(() => getTopProjectClicks(events), [events]);
  const contactFunnel = useMemo(() => getContactFunnel(events), [events]);
  const recentEvents = useMemo(() => [...events].reverse().slice(0, 20), [events]);
  const maxEventCount = useMemo(() => Math.max(1, ...summary.map((item) => item.count)), [summary]);
  const maxProjectCount = useMemo(() => Math.max(1, ...topProjects.map((item) => item.count)), [topProjects]);
  const maxFunnelCount = useMemo(
    () => Math.max(1, ...contactFunnel.steps.map((item) => item.count)),
    [contactFunnel.steps]
  );

  const exportCsv = () => {
    const header = ["timestamp", "event", "payload"];
    const rows = events.map((item) => [
      item.timestamp,
      item.event,
      JSON.stringify(item.payload).replaceAll('"', '""'),
    ]);
    const csvContent = [header.join(","), ...rows.map((row) => `"${row[0]}","${row[1]}","${row[2]}"`)].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background pb-20 pt-28 text-foreground">
      <div className="section-inner">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <HardLink
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <ArrowLeft size={16} />
              Back to Home
            </HardLink>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                {(["today", "7d", "30d", "all"] as DateRange[]).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setDateRange(range)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      dateRange === range
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300"
                    }`}
                  >
                    {range === "today" ? "Today" : range === "all" ? "All" : range}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAllEvents(getStoredAnalyticsEvents())}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  clearStoredAnalyticsEvents();
                  setAllEvents([]);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300"
              >
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>
          </div>

          <div className="section-card rounded-3xl p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Portfolio Analytics</h1>
            <p className="mt-2 text-sm text-gray-500">
              Local event insights for CTA performance, project interest, and funnel behavior.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Total Events</p>
                <p className="mt-2 text-2xl font-bold">{events.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Unique Event Types</p>
                <p className="mt-2 text-2xl font-bold">{summary.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Tracked Projects</p>
                <p className="mt-2 text-2xl font-bold">{topProjects.length}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Event Summary</h2>
                <div className="mt-4 space-y-2">
                  {summary.length ? (
                    summary.map((item) => (
                      <div key={item.event} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.event}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">{item.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${(item.count / maxEventCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No analytics events recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Top Project Interest</h2>
                <div className="mt-4 space-y-2">
                  {topProjects.length ? (
                    topProjects.map((item) => (
                      <div key={item.slug} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.slug}</span>
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{item.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${(item.count / maxProjectCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No project click data available yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Contact Funnel</h2>
              <div className="mt-4 space-y-3">
                {contactFunnel.steps.map((item, index) => {
                  const previous = index === 0 ? null : contactFunnel.steps[index - 1]?.count ?? 0;
                  const conversion =
                    previous && previous > 0 ? Math.round((item.count / previous) * 100) : null;

                  return (
                    <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
                      <div className="mb-1 flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{item.count}</span>
                          {conversion !== null ? (
                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {conversion}% conv
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500"
                          style={{ width: `${(item.count / maxFunnelCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Recent Events</h2>
              <div className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
                {recentEvents.length ? (
                  recentEvents.map((item, index) => (
                    <div key={`${item.event}-${item.timestamp}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/70">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{item.event}</p>
                      <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all text-xs text-gray-600 dark:text-gray-300">
                        {JSON.stringify(item.payload, null, 2)}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent events.</p>
                )}
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}
