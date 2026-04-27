"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EDUCATION } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24 border-t border-gray-200/90 bg-white py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-950">
      <div className="section-inner">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/60">
            <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Academic</p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Education</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EDUCATION.map((item, i) => (
            <motion.div
              key={`${item.degree}-${item.year}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-gray-100 bg-[#fafafa] p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-zinc-900"
            >
              <p className="font-semibold leading-snug text-gray-900 dark:text-white">{item.degree}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.school}</p>
              <p className="mt-3 text-sm font-medium text-orange-600 dark:text-orange-400">{item.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
