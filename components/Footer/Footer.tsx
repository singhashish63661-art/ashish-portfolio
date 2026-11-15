import { NAV_LINKS, isSectionLink } from "@/lib/nav";
import HardLink from "@/components/HardLink/HardLink";
import SectionAnchor from "@/components/SectionAnchor/SectionAnchor";
import { PERSONAL_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 dark:border-white/10 dark:bg-zinc-950 sm:py-12">
      <div className="section-inner">
        <div className="flex flex-col items-center justify-between gap-5 sm:gap-6">
          <HardLink href="/" className="text-center text-sm font-semibold sm:text-left">
            <span className="text-violet-900 dark:text-violet-100">Personal</span>
            <span className="text-violet-500 dark:text-violet-400"> Portfolio</span>
            <span className="text-orange-500">.</span>
          </HardLink>
          <nav className="grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-x-5">
            {NAV_LINKS.map((link) =>
              isSectionLink(link) ? (
                <SectionAnchor
                  key={link.sectionId}
                  sectionId={link.sectionId}
                  className="rounded-lg px-2 py-1.5 transition hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {link.label}
                </SectionAnchor>
              ) : (
                <HardLink
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-1.5 transition hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {link.label}
                </HardLink>
              )
            )}
          </nav>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">Follow me</span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {PERSONAL_INFO.socials.map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-white/15 dark:bg-zinc-900 dark:text-gray-200 dark:hover:border-violet-500 dark:hover:text-violet-300"
              >
                <social.icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} Ashish Singh. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
