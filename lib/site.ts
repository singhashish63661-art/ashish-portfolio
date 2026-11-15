/**
 * Canonical site URL for metadata / JSON-LD / OG (no trailing slash).
 * - Prefer `NEXT_PUBLIC_SITE_URL` in production.
 * - In local dev without env, use localhost + PORT so metadata matches your dev origin.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT ?? "3000";
    return `http://localhost:${port}`;
  }

  return "https://ashish-portfolio-gamma-five.vercel.app";
}

export const SITE_URL = resolveSiteUrl();
