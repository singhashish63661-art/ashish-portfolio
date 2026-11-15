"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import HardLink from "@/components/HardLink/HardLink";

type SectionAnchorProps = {
  sectionId: string;
  className?: string;
  children: ReactNode;
  /** e.g. close mobile menu before navigation */
  onNavigate?: () => void;
};

/**
 * On the home page, use a real hash link for smooth in-page scroll.
 * Elsewhere, full document navigation to `/#section` via HardLink so App Router
 * does not run client RSC fetches (avoids dev "Failed to fetch" in some setups).
 */
export default function SectionAnchor({ sectionId, className, children, onNavigate }: SectionAnchorProps) {
  const pathname = usePathname();
  const hashHref = `#${sectionId}`;

  if (pathname === "/") {
    return (
      <a href={hashHref} className={className} onClick={() => onNavigate?.()}>
        {children}
      </a>
    );
  }

  return (
    <HardLink href={`/#${sectionId}`} className={className} onNavigate={onNavigate}>
      {children}
    </HardLink>
  );
}
