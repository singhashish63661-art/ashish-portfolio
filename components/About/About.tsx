"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FlaskConical, Workflow, IdCard } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";
import VerifiedTag from "@/components/VerifiedTag/VerifiedTag";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-[#fafafa] py-20 sm:py-28 dark:bg-zinc-950">
      <div className="section-inner">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="min-w-0 text-center lg:text-left"
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">About</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.5rem]">
              <span className="relative inline-block">
                Who
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-orange-500" aria-hidden />
              </span>{" "}
              I Am
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {PERSONAL_INFO.about}
            </p>

            <div className="mt-8 rounded-2xl border border-gray-200/90 bg-white/80 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-zinc-900/80 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
                <div className="flex min-w-0 items-center gap-2">
                  <IdCard className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" strokeWidth={2} />
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                    Personal details
                  </p>
                </div>
                <VerifiedTag className="shrink-0" />
              </div>
              <dl className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                {PERSONAL_INFO.personalDetails.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-white/10 sm:border-0 sm:pb-0">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto lg:max-w-none lg:justify-self-end"
          >
            <div
              className="pointer-events-none absolute -left-[12%] top-[8%] z-0 h-[min(100%,420px)] w-[min(100%,420px)] rounded-full bg-violet-400/35 blur-3xl dark:bg-violet-600/25"
              aria-hidden
            />

            <div className="relative z-10 mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-gray-100 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-zinc-800">
              <Image
                src={PERSONAL_INFO.aboutPhoto}
                alt={`${PERSONAL_INFO.name} — workspace`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 520px"
                priority={false}
              />

              <div className="absolute bottom-5 right-5 z-20 flex max-w-[calc(100%-2rem)] flex-col items-end gap-2.5 sm:bottom-6 sm:right-6 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-end">
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/90 bg-white/95 px-3.5 py-2.5 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/95">
                  <Workflow className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" strokeWidth={2} />
                  <span className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white sm:text-xs">
                    Operation Execution
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200/90 bg-white/95 px-3.5 py-2.5 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/95">
                  <FlaskConical className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-400" strokeWidth={2} />
                  <span className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white sm:text-xs">
                    Research & Development
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
