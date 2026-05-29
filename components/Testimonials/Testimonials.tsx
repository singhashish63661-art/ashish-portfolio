"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-24 snap-start border-t border-gray-200/90 bg-white py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-950"
    >
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            What collaborators say
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            Feedback from operations leads and project stakeholders I have worked with.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.figure
              key={`${item.name}-${item.company}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08 }}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-[#fafafa] p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-7"
            >
              <Quote className="h-8 w-8 text-violet-300 dark:text-violet-600" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-gray-200 pt-4 dark:border-white/10">
                <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {item.role} · {item.company}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
