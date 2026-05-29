import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import WebVitalsReporter from "@/components/Analytics/WebVitalsReporter";
import PageViewTracker from "@/components/Analytics/PageViewTracker";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";
import JsonLd from "@/components/JsonLd/JsonLd";
import { SITE_URL } from "@/lib/site";
import { PERSONAL_INFO } from "@/lib/data";

const siteTitle = `Ashish Singh | ${PERSONAL_INFO.title}`;

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Ashish Singh",
  },
  description:
    "Ashish Singh — co-founder of Trackora (GPS & IVMS fleet tracking software) and builder of dashboards and client websites. Portfolio: projects, experience, certifications, notes, and contact.",
  keywords: [
    "Ashish Singh",
    "Co-Founder",
    "Trackora",
    "GPS tracking",
    "IVMS",
    "fleet management",
    "operations",
    "dashboards",
    "React",
    "web development",
    "portfolio",
  ],
  authors: [{ name: "Ashish Singh" }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: siteTitle,
    description:
      "Portfolio: operations, internal dashboards, client websites, certifications, notes, and contact.",
    url: SITE_URL,
    siteName: "Ashish Singh — Portfolio",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description:
      "Portfolio: operations, dashboards, client websites, certifications, notes, and contact.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white font-sans antialiased text-gray-900 dark:bg-zinc-950 dark:text-gray-100">
        <GoogleAnalytics />
        <JsonLd />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WebVitalsReporter />
          <PageViewTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
