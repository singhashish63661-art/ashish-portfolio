"use client";

import type { ReactNode, MouseEvent } from "react";

type HardLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  /** Fired before navigation (e.g. analytics) */
  onNavigate?: () => void;
};

/**
 * Full document navigation via `location.assign`.
 * Avoids App Router client RSC `fetch` which can throw "Failed to fetch" in some dev setups
 * (Turbopack, Cursor preview, 127.0.0.1 vs localhost, etc.).
 */
export default function HardLink({ href, className, children, onNavigate }: HardLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        window.location.assign(href);
      }}
    >
      {children}
    </a>
  );
}
