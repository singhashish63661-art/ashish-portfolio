import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import HardLink from "@/components/HardLink/HardLink";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

type Params = {
  slug: string;
};

function getProjectCoverClass(slug: string): string {
  if (slug === "ssrc-logistics-website") return "object-cover object-[center_62%]";
  return "object-cover";
}

export async function generateStaticParams(): Promise<Params[]> {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Ashish Singh",
      description: "This project page could not be found.",
    };
  }

  return {
    title: project.title,
    description: project.desc,
    openGraph: {
      title: `${project.title} | Ashish Singh`,
      description: project.desc,
      type: "article",
      url: `${SITE_URL}/projects/${project.slug}`,
      images: [{ url: project.coverImage, width: 1200, height: 630, alt: project.title }],
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background pb-20 pt-28 text-foreground">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <HardLink
            href="/#portfolio"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-violet-500 hover:text-violet-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <ArrowLeft size={16} />
            Back to portfolio
          </HardLink>

          <div className="section-card overflow-hidden rounded-3xl">
            <div className="relative aspect-[21/9] min-h-[200px] w-full bg-gray-100 dark:bg-zinc-800">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className={getProjectCoverClass(project.slug)}
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
                {project.category}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {project.tech}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
              {project.desc}
            </p>

            <div className="mt-8 rounded-2xl border border-violet-200/80 bg-violet-50/60 p-5 dark:border-violet-500/25 dark:bg-violet-950/30 sm:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-400">
                My role
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">{project.myRole}</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Problem
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">{project.problem}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Solution
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-300">{project.solution}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Tech Stack
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-gray-900/40">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Impact
                </h2>
                <ul className="mt-3 space-y-2">
                  {project.impact.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700 dark:hover:bg-violet-500"
              >
                View Live Project
                <ArrowUpRight size={16} />
              </a>
            ) : null}
            </div>
          </div>
      </div>
    </main>
  );
}
