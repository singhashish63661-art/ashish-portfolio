import { SITE_URL } from "@/lib/site";
import { PERSONAL_INFO } from "@/lib/data";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSONAL_INFO.name,
  jobTitle: PERSONAL_INFO.title,
  email: PERSONAL_INFO.email,
  telephone: PERSONAL_INFO.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: PERSONAL_INFO.location,
  },
  url: SITE_URL,
  sameAs: PERSONAL_INFO.socials
    .filter((s) => s.name !== "Email" && s.name !== "WhatsApp")
    .map((s) => s.link),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${PERSONAL_INFO.name} — Portfolio`,
  url: SITE_URL,
  description:
    "Professional portfolio of Ashish Singh, co-founder of Trackora — GPS & IVMS fleet tracking software, operations dashboards, and client websites.",
  author: {
    "@type": "Person",
    name: PERSONAL_INFO.name,
    url: SITE_URL,
  },
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([personSchema, websiteSchema]),
      }}
    />
  );
}
