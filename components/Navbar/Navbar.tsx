"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, isSectionLink, SECTION_IDS_FOR_SPY } from "@/lib/nav";
import HardLink from "@/components/HardLink/HardLink";
import SectionAnchor from "@/components/SectionAnchor/SectionAnchor";

type AccentTheme = "violet" | "emerald" | "amber";
const ACCENTS: AccentTheme[] = ["violet", "emerald", "amber"];
const ACCENT_STORAGE_KEY = "portfolio_accent_theme";

function linkIsActive(pathname: string, activeSection: string, link: (typeof NAV_LINKS)[number]): boolean {
  if ("href" in link) {
    if (link.href === "/notes") return pathname === "/notes" || pathname.startsWith("/notes/");
    return pathname === link.href;
  }
  if (pathname === "/") return activeSection === link.sectionId;
  if (link.sectionId === "portfolio" && pathname.startsWith("/projects")) return true;
  return false;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [accentMenuOpen, setAccentMenuOpen] = useState(false);
  const [accent, setAccent] = useState<AccentTheme>("violet");
  const accentMenuDesktopRef = useRef<HTMLDivElement>(null);
  const accentMenuMobileRef = useRef<HTMLDivElement>(null);
  const accentReadyRef = useRef(false);
  const { theme, setTheme } = useTheme();

  const applyAccent = (value: AccentTheme) => {
    setAccent(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
      if (pathname !== "/") return;

      let current = "home";
      for (const id of [...SECTION_IDS_FOR_SPY].reverse()) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    // Hydration-safe initialization: keep first paint deterministic (violet),
    // then apply persisted accent right after mount.
    const raw = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    const initial = ACCENTS.includes(raw as AccentTheme) ? (raw as AccentTheme) : "violet";
    accentReadyRef.current = true;
    window.setTimeout(() => setAccent(initial), 0);
  }, []);

  useEffect(() => {
    if (!accentReadyRef.current) return;
    document.documentElement.setAttribute("data-accent", accent);
    window.localStorage.setItem(ACCENT_STORAGE_KEY, accent);
  }, [accent]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = accentMenuDesktopRef.current?.contains(target);
      const insideMobile = accentMenuMobileRef.current?.contains(target);
      if (insideDesktop || insideMobile) return;
      setAccentMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccentMenuOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const accentLabel = `${accent[0]?.toUpperCase()}${accent.slice(1)}`;
  const accentDotClass =
    accent === "emerald" ? "bg-emerald-500" : accent === "amber" ? "bg-amber-500" : "bg-violet-500";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-200/90 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90"
            : "border-b border-transparent bg-white/80 backdrop-blur-md dark:bg-zinc-950/70"
        }`}
      >
        <div
          className={`section-inner flex items-center gap-3 transition-[padding] duration-300 sm:gap-4 ${
            scrolled ? "py-3" : "py-4"
          }`}
        >
          <HardLink href="/" className="shrink-0 text-lg font-bold tracking-tight sm:text-xl">
            <span className="text-violet-900 dark:text-violet-100">Personal</span>
            <span className="text-violet-500 dark:text-violet-400"> Portfolio</span>
            <span className="text-orange-500">.</span>
          </HardLink>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-x-1 xl:gap-x-2 2xl:gap-x-3 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = linkIsActive(pathname, activeSection, link);
              const className = `whitespace-nowrap rounded-lg px-1.5 py-1.5 text-center text-[12px] font-semibold transition sm:text-[13px] ${
                active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
              }`;
              if (isSectionLink(link)) {
                return (
                  <SectionAnchor key={link.sectionId} sectionId={link.sectionId} className={className}>
                    {link.label}
                  </SectionAnchor>
                );
              }
              return (
                <HardLink key={link.href} href={link.href} className={className}>
                  {link.label}
                </HardLink>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
              <SectionAnchor
                sectionId="contact"
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 sm:px-5 sm:py-2.5 dark:hover:bg-violet-500"
              >
                Hire Me
              </SectionAnchor>
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative rounded-full border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
              <div className="relative" ref={accentMenuDesktopRef}>
                <button
                  type="button"
                  aria-label={`Select accent theme (current: ${accentLabel})`}
                  aria-expanded={accentMenuOpen}
                  onClick={() => setAccentMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                >
                  <Palette className="h-4 w-4" />
                  <span className={`h-2.5 w-2.5 rounded-full ${accentDotClass}`} />
                  <span>{accentLabel}</span>
                </button>
                {accentMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-36 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900">
                    {ACCENTS.map((item) => {
                      const label = `${item[0]?.toUpperCase()}${item.slice(1)}`;
                      const dot = item === "emerald" ? "bg-emerald-500" : item === "amber" ? "bg-amber-500" : "bg-violet-500";
                      const active = accent === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            applyAccent(item);
                            setAccentMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                            active
                              ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative rounded-full border border-gray-200 p-2.5 dark:border-white/10"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
              <div className="relative" ref={accentMenuMobileRef}>
                <button
                  type="button"
                  aria-label={`Select accent theme (current: ${accentLabel})`}
                  aria-expanded={accentMenuOpen}
                  onClick={() => setAccentMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-2 text-[11px] font-semibold text-gray-700 dark:border-white/10 dark:text-gray-200"
                >
                  <Palette className="h-4 w-4" />
                  <span className={`h-2.5 w-2.5 rounded-full ${accentDotClass}`} />
                </button>
                {accentMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-36 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900">
                    {ACCENTS.map((item) => {
                      const label = `${item[0]?.toUpperCase()}${item.slice(1)}`;
                      const dot = item === "emerald" ? "bg-emerald-500" : item === "amber" ? "bg-amber-500" : "bg-violet-500";
                      const active = accent === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            applyAccent(item);
                            setAccentMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                            active
                              ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="rounded-full p-2 text-gray-800 dark:text-gray-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-4 top-[4.5rem] z-40 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const className =
                  "rounded-xl px-4 py-3 text-base font-semibold text-gray-800 hover:bg-violet-50 hover:text-violet-700 dark:text-gray-100 dark:hover:bg-violet-950/50 dark:hover:text-violet-300";
                if (isSectionLink(link)) {
                  return (
                    <SectionAnchor
                      key={link.sectionId}
                      sectionId={link.sectionId}
                      onNavigate={() => setIsOpen(false)}
                      className={className}
                    >
                      {link.label}
                    </SectionAnchor>
                  );
                }
                return (
                  <HardLink
                    key={link.href}
                    href={link.href}
                    className={className}
                    onNavigate={() => setIsOpen(false)}
                  >
                    {link.label}
                  </HardLink>
                );
              })}
              <SectionAnchor
                sectionId="contact"
                onNavigate={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-violet-600 py-3 text-center text-sm font-bold text-white"
              >
                Hire Me
              </SectionAnchor>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
