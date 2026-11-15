"use client";

import { PROJECTS, type PortfolioTab } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import HardLink from "@/components/HardLink/HardLink";

const TABS: { id: "all" | PortfolioTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Dashboards", label: "Dashboards" },
  { id: "Websites", label: "Websites" },
];

type CardInteractionState = { rotateX: number; rotateY: number; x: number; y: number };
const defaultInteraction: CardInteractionState = { rotateX: 0, rotateY: 0, x: 50, y: 50 };

export default function Projects() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [interactions, setInteractions] = useState<Record<string, CardInteractionState>>({});

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("all", PROJECTS.length);
    for (const p of PROJECTS) {
      map.set(p.portfolioTab, (map.get(p.portfolioTab) ?? 0) + 1);
    }
    return map;
  }, []);

  const filtered = useMemo(
    () => (activeTab === "all" ? PROJECTS : PROJECTS.filter((p) => p.portfolioTab === activeTab)),
    [activeTab]
  );

  const handleMouseMove = (slug: string, event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateY = ((x - 50) / 50) * 5;
    const rotateX = -((y - 50) / 50) * 5;
    setInteractions((prev) => ({ ...prev, [slug]: { rotateX, rotateY, x, y } }));
  };

  const handleMouseLeave = (slug: string) => {
    setInteractions((prev) => ({ ...prev, [slug]: defaultInteraction }));
  };

  return (
    <section id="portfolio" className="scroll-mt-24 snap-start bg-white py-20 sm:py-28 dark:bg-zinc-950">
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Portfolio</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
              Selected Work
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Internal dashboards and client websites built with React and modern web tooling—grouped by project type.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50 via-fuchsia-50/70 to-orange-50 px-3 py-3 dark:border-violet-500/20 dark:from-violet-950/30 dark:via-fuchsia-950/20 dark:to-orange-950/20 sm:gap-3">
          {TABS.map((tab) => {
            const count = counts.get(tab.id === "all" ? "all" : tab.id) ?? 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  trackEvent("portfolio_tab_change", { tab: tab.id });
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-violet-600 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25 dark:border-violet-500 dark:from-violet-600 dark:to-fuchsia-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-700 dark:border-white/10 dark:bg-zinc-900 dark:text-gray-200 dark:hover:border-orange-500/40"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs opacity-80 ${isActive ? "text-white/90" : ""}`}>({count})</span>
              </button>
            );
          })}
        </div>

        <motion.div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const i = interactions[project.slug] ?? defaultInteraction;
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-zinc-900"
                  onMouseMove={(e) => handleMouseMove(project.slug, e)}
                  onMouseLeave={() => handleMouseLeave(project.slug)}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `perspective(1000px) rotateX(${i.rotateX}deg) rotateY(${i.rotateY}deg)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at ${i.x}% ${i.y}%, rgba(124,58,237,0.18), transparent 45%)`,
                    }}
                  />
                  <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-orange-500 to-violet-500" />

                  <div className="relative z-[2] p-6 sm:p-8">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <span className="inline-block rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                          {project.portfolioTab}
                        </span>
                        <h3 className="mt-3 text-xl font-bold tracking-tight text-gray-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 sm:text-2xl">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.tech}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <HardLink
                          href={`/projects/${project.slug}`}
                          onNavigate={() => trackEvent("project_case_study_click", { project_slug: project.slug })}
                          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-violet-500 hover:text-violet-600 dark:border-gray-600 dark:text-gray-200"
                        >
                          Case Study
                        </HardLink>
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackEvent("project_live_link_click", { project_slug: project.slug })}
                            aria-label={`Open ${project.title}`}
                            className="rounded-full bg-violet-600 p-3 text-white shadow-md transition hover:bg-violet-700"
                          >
                            <ArrowUpRight size={18} />
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">{project.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
