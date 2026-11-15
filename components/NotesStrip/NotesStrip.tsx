"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import HardLink from "@/components/HardLink/HardLink";
import { getLatestNotes } from "@/lib/notes";
import { trackEvent } from "@/lib/analytics";

const LATEST_NOTES = getLatestNotes(3);

function formatNoteDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NotesStrip() {
  return (
    <section
      id="writing"
      className="scroll-mt-24 snap-start border-t border-gray-200/90 bg-[#fafafa] py-20 sm:py-28 dark:border-white/10 dark:bg-zinc-900/40"
    >
      <div className="section-inner">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Writing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Latest notes
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              Short articles on dashboards, client delivery, and operational data.
            </p>
          </div>
          <HardLink
            href="/notes"
            onNavigate={() => trackEvent("notes_view_all_click", { source: "home_strip" })}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-bold text-violet-700 transition hover:border-violet-400 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-zinc-950 dark:text-violet-300 dark:hover:bg-violet-950/50"
          >
            View all notes
            <ArrowRight className="h-4 w-4" />
          </HardLink>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {LATEST_NOTES.map((note, index) => (
            <motion.article
              key={note.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.07 }}
              className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-white/10 dark:bg-zinc-950 dark:hover:border-violet-500/30"
            >
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                <FileText className="h-4 w-4" aria-hidden />
                <time className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {formatNoteDate(note.date)}
                </time>
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
                <HardLink
                  href={`/notes/${note.slug}`}
                  onNavigate={() => trackEvent("note_card_click", { slug: note.slug, source: "home_strip" })}
                  className="outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  {note.title}
                </HardLink>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note.excerpt}</p>
              <HardLink
                href={`/notes/${note.slug}`}
                onNavigate={() => trackEvent("note_read_more_click", { slug: note.slug, source: "home_strip" })}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Read note
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </HardLink>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
