"use client";

import { SKILLS } from "@/lib/data";
import { motion } from "framer-motion";
import { Code2, PenTool, Database } from "lucide-react";

export default function Skills() {
  const getIcon = (category: string) => {
    if (category.includes("Technical")) return <Code2 className="text-violet-600 dark:text-violet-400" size={24} />;
    if (category.includes("Tools")) return <Database className="text-fuchsia-600 dark:text-fuchsia-400" size={24} />;
    return <PenTool className="text-emerald-600 dark:text-emerald-400" size={24} />;
  };

  return (
    <section id="skills" className="scroll-mt-24 snap-start border-t border-gray-200/90 bg-[#fafafa] py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-900/40">
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Skills</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Core Competencies
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            Practical tools and strengths used across analytics, operations, and web delivery.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SKILLS.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-zinc-950 sm:p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50">
                  {getIcon(category.category)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
