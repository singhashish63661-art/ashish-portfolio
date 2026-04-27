import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import HardLink from "@/components/HardLink/HardLink";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";
import { NOTES } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  if (!note) {
    return { title: "Note not found" };
  }
  return {
    title: note.title,
    description: note.excerpt,
    openGraph: {
      title: `${note.title} | Ashish Singh`,
      description: note.excerpt,
      type: "article",
      publishedTime: note.date,
      url: `${SITE_URL}/notes/${note.slug}`,
    },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  if (!note) notFound();

  return (
    <>
      <Navbar />
      <main id="content" className="min-h-screen scroll-mt-24 bg-white pb-24 pt-28 dark:bg-zinc-950">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <HardLink
            href="/notes"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            All notes
          </HardLink>
          <time className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">
            {new Date(note.date + "T12:00:00").toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{note.title}</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{note.excerpt}</p>

          <div className="mt-10 space-y-4 text-gray-700 dark:text-gray-300">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 border-b border-gray-100 pb-2 text-xl font-bold text-gray-900 first:mt-0 dark:border-white/10 dark:text-white">
                    {children}
                  </h2>
                ),
                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mt-2 list-disc space-y-2 pl-5">{children}</ul>,
                ol: ({ children }) => <ol className="mt-2 list-decimal space-y-2 pl-5">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}
