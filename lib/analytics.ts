export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
export type StoredAnalyticsEvent = {
  event: string;
  timestamp: string;
  payload: AnalyticsPayload;
};

const LOCAL_ANALYTICS_KEY = "portfolio_analytics_events";
const MAX_LOCAL_ANALYTICS_EVENTS = 300;

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const data = { event, ...payload };

  const win = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };

  if (typeof win.gtag === "function") {
    win.gtag("event", event, payload);
  } else if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(data);
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const existing = raw ? (JSON.parse(raw) as StoredAnalyticsEvent[]) : [];
    const next = [
      ...existing,
      {
        event,
        timestamp: new Date().toISOString(),
        payload,
      },
    ].slice(-MAX_LOCAL_ANALYTICS_EVENTS);
    window.localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(next));
  } catch {
    // Ignore local storage errors silently
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", data);
  }
}

export function getStoredAnalyticsEvents(): StoredAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ANALYTICS_KEY);
    return raw ? (JSON.parse(raw) as StoredAnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearStoredAnalyticsEvents() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_ANALYTICS_KEY);
  } catch {
    // Ignore local storage errors silently
  }
}
