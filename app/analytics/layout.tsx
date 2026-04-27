import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Analytics (private)",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
