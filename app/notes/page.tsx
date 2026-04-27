import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import HardLink from "@/components/HardLink/HardLink";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";
import { NOTES } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short articles on operations dashboards, client websites, and turning spreadsheets into reliable reporting.",
  openGraph: {
    title: "Notes | Ashish Singh",
    description: "Articles on dashboards, delivery, and operations tooling.",
    url: `${SITE_URL}/notes`,
    type: "website",
  },
};

export default function NotesPage() {
  const sorted = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Navbar />
      <main id="content" className="min-h-screen scroll-mt-24 bg-white pb-20 pt-28 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <HardLink
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to home
          </HardLink>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Writing</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Notes</h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Practical write-ups on how I approach dashboards, client sites, and operational data—no fluff.
          </p>

          <ul className="mt-12 space-y-6">
            {sorted.map((note) => (
              <li key={note.slug}>
                <article className="rounded-2xl border border-gray-100 bg-[#fafafa] p-6 transition hover:border-violet-200 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-violet-500/30 sm:p-7">
                  <time className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {new Date(note.date + "T12:00:00").toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                    <HardLink href={`/notes/${note.slug}`} className="transition hover:text-violet-600 dark:hover:text-violet-400">
                      {note.title}
                    </HardLink>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note.excerpt}</p>
                  <HardLink
                    href={`/notes/${note.slug}`}
                    className="mt-4 inline-flex text-sm font-bold text-violet-600 dark:text-violet-400"
                  >
                    Read article →
                  </HardLink>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
