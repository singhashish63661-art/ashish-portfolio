import { ArrowLeft, Home } from "lucide-react";
import HardLink from "@/components/HardLink/HardLink";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-20 dark:bg-zinc-950">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">404</p>
      <h1 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-center text-gray-600 dark:text-gray-400">
        The link may be outdated or the page was moved. Head back to the portfolio home to continue.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <HardLink
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-violet-700 dark:hover:bg-violet-500"
        >
          <Home className="h-4 w-4" strokeWidth={2.5} />
          Back to home
        </HardLink>
        <HardLink
          href="/#portfolio"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-violet-600 px-6 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 dark:border-violet-500 dark:text-violet-300 dark:hover:bg-violet-950/40"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          View portfolio
        </HardLink>
      </div>
    </main>
  );
}
