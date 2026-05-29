import {
  EDUCATION,
  EXPERIENCE,
  PERSONAL_INFO,
  PROJECTS,
  SKILLS,
} from "@/lib/data";

/** Portfolio payload for the chat model — excludes sensitive personal fields (DOB, blood group). */
export function getPortfolioContextForChat() {
  const locationShort =
    PERSONAL_INFO.personalDetails.find((item) => item.label === "Location")?.value ??
    PERSONAL_INFO.location;

  return {
    personal: {
      name: PERSONAL_INFO.name,
      title: PERSONAL_INFO.title,
      subtitle: PERSONAL_INFO.subtitle,
      email: PERSONAL_INFO.email,
      phone: PERSONAL_INFO.phone,
      location: locationShort,
      heroIntro: PERSONAL_INFO.heroIntro,
      about: PERSONAL_INFO.about,
      socials: PERSONAL_INFO.socials.map(({ name, link }) => ({ name, link })),
    },
    skills: SKILLS,
    experience: EXPERIENCE,
    projects: PROJECTS.map(({ slug, title, desc, link, category, portfolioTab, stack }) => ({
      slug,
      title,
      desc,
      link,
      category,
      portfolioTab,
      stack,
    })),
    education: EDUCATION,
  };
}
