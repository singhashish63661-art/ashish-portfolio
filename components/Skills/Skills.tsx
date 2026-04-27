"use client";
import { SKILLS } from "../../lib/data";
import { motion } from "framer-motion";
import { Code2, PenTool, Database } from "lucide-react";

export default function Skills() {
  const getIcon = (category: string) => {
    if (category.includes("Technical")) return <Code2 className="text-blue-500" size={24} />;
    if (category.includes("Tools")) return <Database className="text-purple-500" size={24} />;
    return <PenTool className="text-green-500" size={24} />;
  };

  return (
    <section id="skills" className="snap-start scroll-mt-24 relative overflow-hidden py-20 sm:py-24">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
        style={{ backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="section-shell relative z-10">
        <div className="section-heading mb-14 sm:mb-16">
          <span className="section-kicker">Expertise</span>
          <h2 className="heading-display mt-2">Core Competencies</h2>
          <p className="text-muted mx-auto mt-3 max-w-2xl">
            Practical tools and technical strengths used across analytics, operations, and web delivery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SKILLS.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="section-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-8"
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-xl bg-white p-3 shadow-md transition-transform group-hover:scale-110 dark:bg-gray-800">
                  {getIcon(category.category)}
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{category.category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-default"
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
