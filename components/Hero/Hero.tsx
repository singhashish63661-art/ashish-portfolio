"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Box, Download, PenTool } from "lucide-react";
import { PERSONAL_INFO, RESUME_FILE, SITE_HIGHLIGHTS } from "@/lib/data";
import DigitalClock from "@/components/DigitalClock/DigitalClock";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen scroll-mt-24 snap-start items-center overflow-hidden bg-white pb-16 pt-28 dark:bg-zinc-950 sm:pb-24 sm:pt-32"
    >
      {/* Soft ambient glows (reference) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[25%] top-[5%] h-[min(95vw,560px)] w-[min(95vw,560px)] rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-600/12" />
        <div className="absolute -right-[20%] bottom-[0%] h-[min(80vw,480px)] w-[min(80vw,480px)] rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-600/10" />
      </div>

      <div className="section-inner relative z-10">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <div className="mb-7 flex flex-col items-center gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-start lg:gap-4">
              <DigitalClock />
              {/* Subtitle pill — light purple / dark purple text */}
              <div className="inline-flex min-w-0 max-w-full rounded-full border border-violet-200/70 bg-gradient-to-r from-violet-100 via-fuchsia-100 to-orange-100 px-4 py-2 dark:border-violet-500/30 dark:bg-gradient-to-r dark:from-violet-950/70 dark:via-fuchsia-950/50 dark:to-orange-950/50">
                <p className="text-left text-[11px] font-semibold uppercase leading-snug tracking-wide text-violet-900 sm:text-xs dark:text-violet-200">
                  {PERSONAL_INFO.subtitle}
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
              <span className="relative inline-block">
                Hi, I&apos;m
                <span
                  className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-violet-500 to-orange-500"
                  aria-hidden
                />
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
                {PERSONAL_INFO.name}
              </span>
            </h1>

            <p className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
              {PERSONAL_INFO.title}
            </p>

            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400 lg:mx-0">
              {PERSONAL_INFO.heroIntro}
            </p>

            <dl className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-3 py-5 sm:grid-cols-3 lg:mx-0">
              {SITE_HIGHLIGHTS.map((row, idx) => (
                <div
                  key={row.label}
                  className={`rounded-xl border px-3 py-3 text-center shadow-sm lg:text-left ${
                    idx === 0
                      ? "border-violet-200/80 bg-violet-50/80 dark:border-violet-500/25 dark:bg-violet-950/25"
                      : idx === 1
                        ? "border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-500/25 dark:bg-emerald-950/20"
                        : "border-orange-200/80 bg-orange-50/80 dark:border-orange-500/25 dark:bg-orange-950/20"
                  }`}
                >
                  <dt className="text-[10px] font-bold uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px]">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-violet-600 dark:text-violet-400 sm:text-2xl">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <a
                href="#contact"
                onClick={() => trackEvent("cta_hire_me_click", { location: "hero" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-600/25 transition hover:brightness-110 dark:from-violet-600 dark:to-fuchsia-600"
              >
                Hire Me
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <a
                href="#portfolio"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-violet-600 bg-white px-8 py-3.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50 dark:border-violet-500 dark:bg-zinc-950 dark:text-violet-300 dark:hover:bg-violet-950/30"
              >
                View Portfolio
              </a>
            </div>

            <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10 lg:items-start">
              <a
                href={RESUME_FILE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_resume_download_click", { location: "hero" })}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 underline-offset-4 hover:underline dark:text-gray-200"
              >
                <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" strokeWidth={2.25} />
                Download CV
              </a>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:items-start">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Follow me:</span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {PERSONAL_INFO.socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-white/15 dark:bg-zinc-900 dark:text-gray-100 dark:hover:border-violet-500"
                    >
                      <social.icon size={18} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative mx-auto flex w-full max-w-[360px] justify-center lg:mx-0 lg:max-w-none lg:justify-end"
          >
            <div className="relative aspect-[3/4] w-full max-w-[340px]">
              {/* Purple shape — behind top-left of photo */}
              <div
                className="pointer-events-none absolute -left-[18%] -top-[8%] z-0 h-[min(72%,280px)] w-[min(72%,280px)] rounded-full bg-violet-400/45 blur-[2px] dark:bg-violet-500/30"
                aria-hidden
              />
              {/* Orange solid circle — behind bottom-right */}
              <div
                className="pointer-events-none absolute -bottom-[10%] -right-[12%] z-0 h-[min(78%,300px)] w-[min(78%,300px)] rounded-full bg-orange-400 dark:bg-orange-500"
                aria-hidden
              />

              {/* Floating circular badges (reference: pen top-right, box bottom-left) */}
              <motion.div
                className="absolute -right-1 top-[6%] z-20 flex h-14 w-14 items-center justify-center rounded-full border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-lg dark:border-white/10 dark:from-zinc-800 dark:to-violet-950/80"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <PenTool className="h-6 w-6 text-violet-600 dark:text-violet-400" strokeWidth={2} />
              </motion.div>
              <motion.div
                className="absolute -left-1 bottom-[20%] z-20 flex h-14 w-14 items-center justify-center rounded-full border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-lg dark:border-white/10 dark:from-zinc-800 dark:to-violet-950/80"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <Box className="h-6 w-6 text-violet-600 dark:text-violet-400" strokeWidth={2} />
              </motion.div>

              <div className="relative z-10 h-full w-full overflow-hidden rounded-[1.75rem] border-[3px] border-white bg-gray-100 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] dark:border-zinc-700 dark:bg-zinc-800 sm:rounded-[2rem]">
                <Image
                  src="/profile.jpg"
                  alt={PERSONAL_INFO.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 340px, 400px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
