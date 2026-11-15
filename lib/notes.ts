export type Note = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  /** Markdown body */
  content: string;
};

export function getLatestNotes(limit = 3): Note[] {
  return [...NOTES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export const NOTES: Note[] = [
  {
    slug: "structuring-ops-dashboards",
    title: "How I structure internal operations dashboards",
    date: "2026-03-15",
    excerpt:
      "A practical order of work: problem statement, metrics, data sources, then UI—so the tool matches how teams actually decide.",
    content: `## Start with the decision, not the chart

Before touching components, I write down **who** opens the dashboard, **how often**, and **what decision** they should leave with. If that is not crisp, the UI will look fine and still fail in production.

## Metrics second

I list 5–7 KPIs maximum. Each one needs an owner and a refresh cadence (real-time, daily, weekly). Everything else is a drill-down or a future phase.

## Stack and constraints

I usually ship with **React** on the front end because it is easy to iterate with stakeholders. Performance and mobile use get explicit checks early—field teams do not always have perfect networks.

## Handover

Short README for the team: where data comes from, how to report a bug, and who to ping when numbers look wrong. That last part saves more time than any animation.`,
  },
  {
    slug: "static-sites-for-clients",
    title: "Shipping fast client sites without over-engineering",
    date: "2026-02-02",
    excerpt:
      "When a business needs presence quickly, I default to clear pages, fast loads, and content that answers three questions: what you do, proof, and how to contact.",
    content: `## The three questions

Most small business sites fail because visitors cannot answer:

1. **What do you do?** — One sentence above the fold.
2. **Why trust you?** — Projects, logos, or process—not buzzwords.
3. **What is the next step?** — Call, WhatsApp, or form—one primary action.

## Performance as credibility

A slow site reads as neglected. I keep images lean, avoid unnecessary client JS, and test on mid-range phones—not only on a developer laptop.

## Content workflow

I draft structure first in plain text with the client, then design. Reordering sections in a doc is cheaper than redesigning in the browser.

## Deploy and ownership

I document the hosting account, domain DNS, and how to update copy so the client is not locked in.`,
  },
  {
    slug: "from-spreadsheet-to-dashboard",
    title: "From spreadsheet chaos to a single source of truth",
    date: "2026-01-10",
    excerpt:
      "Spreadsheets are flexible; they also diverge. Here is how I move teams toward one dashboard without pretending Excel will disappear overnight.",
    content: `## Respect the spreadsheet

Spreadsheets exist because someone needed speed. I map **which file is canonical** for each metric and who edits it. Fighting that reality creates shadow copies.

## One metric, one definition

I write a one-line definition per KPI and where the number is pulled from. Arguments about “why my number differs” drop sharply after this step.

## Phased cutover

Phase 1: read-only dashboard that mirrors what people already trust.  
Phase 2: deprecate duplicate sheets once stakeholders agree the dashboard matches.  
Phase 3: alerts or exports only when the base is stable.

## What I learned

The technical build is rarely the bottleneck. Alignment on definitions and ownership determines whether the dashboard survives the next quarter.`,
  },
];
