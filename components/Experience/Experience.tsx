"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-t border-gray-200/90 bg-[#fafafa] py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-950">
      <div className="section-inner">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50">
            <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600 dark:text-orange-400">Career</p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Work Experience</h2>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          {EXPERIENCE.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                <div className="relative mx-auto h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white sm:mx-0 dark:border-white/10 dark:bg-zinc-950">
                  <Image src={job.logo} alt={`${job.company} logo`} fill className="object-contain p-2" sizes="72px" />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">{job.role}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{job.company}</p>
                  <p className="mt-1 text-sm font-semibold text-violet-600 dark:text-violet-400">{job.period}</p>
                  <ul className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-left dark:border-white/10">
                    {job.desc.map((line, j) => (
                      <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
