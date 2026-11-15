import {
  EDUCATION,
  EXPERIENCE,
  PERSONAL_INFO,
  PROJECTS,
  SKILLS,
  SITE_HIGHLIGHTS,
} from "@/lib/data";
import type { BackupResponse } from "@/lib/chat-types";

const PRIVATE_INFO_DECLINE =
  "I can help with Ashish's **skills**, **projects**, **experience**, **education**, **contact details**, or **resume** — not private personal details.";

function getLocationShort(): string {
  return (
    PERSONAL_INFO.personalDetails.find((item) => item.label === "Location")?.value ??
    PERSONAL_INFO.location
  );
}

function isPrivatePersonalQuery(q: string): boolean {
  return (
    q.includes("blood group") ||
    q.includes("blood type") ||
    (q.includes("blood") && !q.includes("blood pressure")) ||
    q.includes("age") ||
    q.includes("old are") ||
    q.includes("how old") ||
    q.includes("date of birth") ||
    q.includes("dob") ||
    q.includes("birthday")
  );
}

function isLocationQuery(q: string): boolean {
  return (
    q.includes("location") ||
    q.includes("based in") ||
    q.includes("where is ashish") ||
    q.includes("where does ashish") ||
    q.includes("where do you work") ||
    q.includes("where are you based")
  );
}

/** Keyword backup when Gemini is unavailable — no DOB, blood group, or age. */
export function getBackupResponse(query: string): BackupResponse {
  const q = query.toLowerCase();
  const topProjects = PROJECTS.slice(0, 3)
    .map(
      (project) =>
        `- **${project.title}**${project.link ? `: [View project](${project.link})` : `: [Case study](/projects/${project.slug})`}`
    )
    .join("\n");
  const skillsSummary = SKILLS.map((group) => `**${group.category}:** ${group.items.join(", ")}`).join("\n");
  const experienceSummary = EXPERIENCE.map(
    (role) => `- **${role.role}** at **${role.company}** (${role.period})`
  ).join("\n");
  const educationSummary = EDUCATION.map(
    (item) => `- **${item.degree}** - ${item.school} (${item.year})`
  ).join("\n");
  const yearsExperience =
    SITE_HIGHLIGHTS.find((item) => item.label.toLowerCase().includes("years"))?.value ?? "3+";

  if (q.includes("meet") || q.includes("schedule") || q.includes("call") || q.includes("book")) {
    return {
      text: "I can help you schedule a meeting with Ashish. Please choose a method below:",
      type: "calendar",
    };
  }

  if (
    q.includes("social") ||
    q.includes("linkedin") ||
    q.includes("linkdin") ||
    q.includes("linkind") ||
    q.includes("github") ||
    q.includes("insta") ||
    q.includes("instagram") ||
    q.includes("profile")
  ) {
    return {
      text: `You can connect with Ashish here:\n- [LinkedIn](${PERSONAL_INFO.socials[0].link})\n- [GitHub](${PERSONAL_INFO.socials[1].link})\n- [Instagram](${PERSONAL_INFO.socials[3].link})`,
      type: "socials",
    };
  }

  if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
    return {
      text: "You can download Ashish's resume here:",
      type: "resume",
    };
  }

  if (q.includes("contact") || q.includes("mail") || q.includes("email") || q.includes("phone")) {
    return {
      text: `You can reach Ashish at **${PERSONAL_INFO.email}** or call **${PERSONAL_INFO.phone}**. You can also use the contact form on this page.`,
      type: "text",
    };
  }

  if (q.includes("about") || q.includes("yourself") || q.includes("who are you")) {
    return {
      text: `Ashish is a **${PERSONAL_INFO.title}** based in **${getLocationShort()}**. ${PERSONAL_INFO.about}`,
      type: "text",
    };
  }

  if (isPrivatePersonalQuery(q)) {
    return { text: PRIVATE_INFO_DECLINE, type: "text" };
  }

  if (isLocationQuery(q)) {
    return {
      text: `Ashish is based in **${getLocationShort()}**.`,
      type: "text",
    };
  }

  if (
    q.includes("year of exp") ||
    q.includes("years of exp") ||
    q.includes("years experience") ||
    q.includes("year experience") ||
    q.includes("exprence") ||
    q.includes("experiance") ||
    (q.includes("year") && q.includes("exp"))
  ) {
    return {
      text: `Ashish has **${yearsExperience}** years of operations and delivery experience, with hands-on work in dashboards, internal systems, and client websites.`,
      type: "text",
    };
  }

  if (q.includes("skill") || q.includes("tools") || q.includes("technology") || q.includes("tech stack")) {
    return {
      text: `Here are Ashish's core skills:\n${skillsSummary}`,
      type: "text",
    };
  }

  if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("career")) {
    return {
      text: `Ashish's recent experience includes:\n${experienceSummary}`,
      type: "text",
    };
  }

  if (q.includes("education") || q.includes("study") || q.includes("college") || q.includes("degree")) {
    return {
      text: `Ashish's education background:\n${educationSummary}`,
      type: "text",
    };
  }

  if (q.includes("project") || q.includes("dashboard")) {
    return {
      text: `Here are a few featured projects by Ashish:\n${topProjects}`,
      type: "project-preview",
      data: PROJECTS[0],
    };
  }

  return {
    text: "I can help with **skills**, **projects**, **experience**, **education**, **contact details**, or **resume download**. Try asking a specific question about Ashish.",
    type: "text",
  };
}
