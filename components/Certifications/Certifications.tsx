"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24 border-t border-gray-200/90 bg-white py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-950">
      <div className="section-inner">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
            <BadgeCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-400">Credentials</p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Certifications</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={`${cert.title}-${cert.issuer}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-2xl border border-gray-100 bg-[#fafafa] p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-zinc-900 sm:p-5"
            >
              <p className="font-semibold leading-snug text-gray-900 dark:text-white">{cert.title}</p>
              <p className="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400">{cert.issuer}</p>
              {cert.year ? (
                <p className="mt-2 inline-flex rounded-full border border-orange-200/80 bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-800 dark:border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-300">
                  {cert.year}
                </p>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
