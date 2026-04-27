# Developer Guide

This guide is the source of truth for future redevelopment of this portfolio.
Use it before making architecture, content, UI, or chatbot changes.

## 1) Project Purpose

- Build a fast, SEO-friendly personal portfolio with strong credibility and clear case studies.
- Keep content updates easy via `lib/data.ts`.
- Keep UX polished on mobile first, then desktop refinement.

## 2) Stack and Runtime

- Framework: `Next.js` App Router (`app/`)
- Language: `TypeScript`
- UI: `Tailwind CSS`, `Framer Motion`, `lucide-react`
- Chat API: `app/api/chat/route.ts` (Gemini + backup logic)
- Tests: `vitest`

## 3) Current Architecture

- `app/layout.tsx`: global metadata, theme provider, analytics hooks, JSON-LD.
- `app/page.tsx`: composition root for landing sections.
- `lib/data.ts`: main content model (hero, projects, experience, education, certifications, socials).
- `lib/site.ts`: canonical URL resolution (`NEXT_PUBLIC_SITE_URL`/`VERCEL_URL`/localhost fallback).
- `components/HardLink/HardLink.tsx`: full-document navigation for internal route links to avoid dev fetch issues.
- `components/SectionAnchor/SectionAnchor.tsx`: hash section links with route-aware behavior.
- `components/ChatBot/ChatBot.tsx`: client chat UI.
- `app/api/chat/route.ts`: chat request validation, rate limiting, AI + backup response.

## 4) Development Workflow (Required)

1. Pull latest branch.
2. Install deps: `npm install`
3. Start dev: `npm run dev`
4. Before opening PR / pushing:
   - `npm run lint`
   - `npm run test:run` (if tests are touched or related)
   - `npm run build`

If dev gets stale:

```bash
rm -rf .next
npm run dev
```

## 5) Content Update Rules

Most profile content must be edited in `lib/data.ts`, not hardcoded in components.

- Personal info: `PERSONAL_INFO`
- Experience: `EXPERIENCE`
- Projects: `PROJECTS`
- Education: `EDUCATION`
- Certifications: `CERTIFICATIONS`

When adding a project:

- Add a unique `slug`
- Add real `impact` bullets (avoid placeholders)
- Put cover in `public/project-covers/`
- Set `coverImage` to that exact path

## 6) UI and Layout Standards

- Use the shared wrapper class `section-inner` for landing section alignment.
- Keep section IDs stable (`home`, `about`, `education`, `experience`, `portfolio`, `contact`) to preserve nav behavior.
- Reuse existing visual primitives (rounded cards, muted text, gradient accents) for consistency.
- Prefer utility classes over one-off custom CSS unless reuse is clear.

## 7) Navigation Rules

- Internal route links should use `HardLink` where already used in codebase conventions.
- Section links should use `SectionAnchor`.
- Do not reintroduce `next/link` without validating dev behavior around route fetch errors.
- Keep CTA tracking events when changing link components.

## 8) Chatbot Rules

### Files

- UI: `components/ChatBot/ChatBot.tsx`
- API logic: `app/api/chat/route.ts`

### UI

- Keep keyboard accessibility (Escape to close, focus trap, Enter to send).
- Keep first message privacy note visible in chat history.
- Keep quick prompts focused on high-intent user actions.

### API

- Validate payload size and message length.
- Keep rate limiting enabled (Upstash if env vars exist, memory fallback otherwise).
- Preserve deterministic backup responses for reliability when AI is unavailable.

## 9) SEO and Metadata Rules

- Page metadata should include title + description + canonical/OG where relevant.
- Keep `SITE_URL` logic environment-safe.
- Update `app/sitemap.ts` and `app/robots.ts` when adding indexable routes.

## 10) Assets and Media

- Store static assets in `public/`.
- Use descriptive filenames (kebab-case).
- Project covers go in `public/project-covers/`.
- Replace old assets when superseded to avoid stale references.

## 11) Environment Variables

Use `.env.local` for local development:

- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL` (optional)
- `UPSTASH_REDIS_REST_TOKEN` (optional)
- `NEXT_PUBLIC_SITE_URL` (recommended in production/staging)

Never commit secret values.

## 12) Quality Checklist Before Merge

- Design matches existing spacing/typography system.
- Responsive behavior checked at mobile + desktop.
- No console errors in browser for changed flows.
- `npm run build` passes.
- New content reflects real, professional details.

## 13) Redevelopment Priorities (When doing a major revamp)

1. Preserve data model in `lib/data.ts` first.
2. Keep route structure stable for SEO.
3. Redesign section components incrementally (Hero -> About -> Projects -> Contact).
4. Revalidate navigation and chat interaction after each phase.
5. Re-check metadata, sitemap, and robots before release.

## 14) Common Mistakes to Avoid

- Hardcoding profile text inside UI components.
- Adding routes without metadata updates.
- Mixing multiple container widths that break alignment rhythm.
- Removing analytics events on CTA buttons unintentionally.
- Editing chatbot UI without testing keyboard and mobile behavior.

