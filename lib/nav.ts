/** Primary navigation — sections use in-page anchors; Notes is a separate route. */
export type NavLink =
  | { label: string; sectionId: string }
  | { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", sectionId: "home" },
  { label: "About", sectionId: "about" },
  { label: "Experience", sectionId: "experience" },
  { label: "Skills", sectionId: "skills" },
  { label: "Portfolio", sectionId: "portfolio" },
  { label: "Notes", sectionId: "writing" },
  { label: "Reviews", sectionId: "testimonials" },
  { label: "Contact", sectionId: "contact" },
];

export function navHref(link: NavLink): string {
  if ("href" in link) return link.href;
  return `/#${link.sectionId}`;
}

export function isSectionLink(link: NavLink): link is { label: string; sectionId: string } {
  return "sectionId" in link;
}

export const SECTION_IDS_FOR_SPY = NAV_LINKS.filter(isSectionLink).map((l) => l.sectionId);
