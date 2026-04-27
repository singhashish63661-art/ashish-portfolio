import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PERSONAL_INFO, SKILLS, EXPERIENCE, PROJECTS, EDUCATION, SITE_HIGHLIGHTS } from "@/lib/data";

type ChatReplyType = "text" | "calendar" | "socials" | "resume" | "project-preview";

type BackupResponse = {
  text: string;
  type: ChatReplyType;
  data?: (typeof PROJECTS)[number];
};

const MAX_MESSAGE_LENGTH = 600;
const MAX_BODY_LENGTH = 8_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitStore: Map<string, RateLimitBucket> =
  (globalThis as typeof globalThis & { __chatRateLimitStore?: Map<string, RateLimitBucket> })
    .__chatRateLimitStore ?? new Map();

(globalThis as typeof globalThis & { __chatRateLimitStore?: Map<string, RateLimitBucket> })
  .__chatRateLimitStore = rateLimitStore;

type GlobalWithRateLimiter = typeof globalThis & {
  __chatUpstashLimiter?: Ratelimit;
};

function getUpstashLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const globalRate = globalThis as GlobalWithRateLimiter;
  if (!globalRate.__chatUpstashLimiter) {
    const redis = new Redis({ url, token });
    globalRate.__chatUpstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, `${RATE_LIMIT_WINDOW_MS / 1000} s`),
      analytics: true,
      prefix: "ratelimit:chat",
    });
  }

  return globalRate.__chatUpstashLimiter;
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

async function isRateLimitedForRequest(ip: string): Promise<boolean> {
  const limiter = getUpstashLimiter();
  if (!limiter) {
    return isRateLimited(ip);
  }

  const result = await limiter.limit(ip);
  return !result.success;
}

export async function POST(req: Request) {
  // --- 🧠 INTERNAL BRAIN (The Backup) ---
  // This logic runs if AI fails or if the key is missing.
  const getBackupResponse = (query: string): BackupResponse => {
    const q = query.toLowerCase();
    const topProjects = PROJECTS.slice(0, 3)
      .map((project) => `- **${project.title}**${project.link ? `: [View project](${project.link})` : ""}`)
      .join("\n");
    const skillsSummary = SKILLS.map((group) => `**${group.category}:** ${group.items.join(", ")}`).join("\n");
    const experienceSummary = EXPERIENCE.map((role) => `- **${role.role}** at **${role.company}** (${role.period})`).join("\n");
    const educationSummary = EDUCATION.map((item) => `- **${item.degree}** - ${item.school} (${item.year})`).join("\n");
    const yearsExperience = SITE_HIGHLIGHTS.find((item) => item.label.toLowerCase().includes("years"))?.value ?? "3+";
    const dob = PERSONAL_INFO.personalDetails.find((item) => item.label.toLowerCase() === "date of birth")?.value;
    const bloodGroup = PERSONAL_INFO.personalDetails.find((item) => item.label.toLowerCase() === "blood group")?.value;

    const getAgeFromDob = (dobValue?: string): number | null => {
      if (!dobValue) return null;
      const [dayRaw, monthRaw, yearRaw] = dobValue.split("-");
      const day = Number(dayRaw);
      const month = Number(monthRaw);
      const year = Number(yearRaw);
      if (!day || !month || !year) return null;

      const now = new Date();
      let age = now.getFullYear() - year;
      const hasBirthdayPassed =
        now.getMonth() + 1 > month || (now.getMonth() + 1 === month && now.getDate() >= day);
      if (!hasBirthdayPassed) age -= 1;
      return age >= 0 ? age : null;
    };
    const computedAge = getAgeFromDob(dob);
    
    // 1. MEETING / SCHEDULE
    if (q.includes("meet") || q.includes("schedule") || q.includes("call") || q.includes("book")) {
      return { 
        text: "I can help you schedule a meeting with Ashish. Please choose a method below:", 
        type: "calendar" 
      };
    }

    // 2. SOCIAL MEDIA (with typo-friendly checks)
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
        type: "socials" 
      };
    }

    // 3. RESUME
    if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
      return { 
        text: "You can download Ashish's resume here:", 
        type: "resume" 
      };
    }

    // 4. CONTACT
    if (q.includes("contact") || q.includes("mail") || q.includes("email") || q.includes("phone")) {
      return { 
        text: `You can reach Ashish at **${PERSONAL_INFO.email}** or call **${PERSONAL_INFO.phone}**. You can also use the contact form on this page.`,
        type: "text" 
      };
    }

    // 5. ABOUT
    if (q.includes("about") || q.includes("yourself") || q.includes("who are you")) {
      return {
        text: `Ashish is a **${PERSONAL_INFO.title}** based in **${PERSONAL_INFO.location}**. ${PERSONAL_INFO.about}`,
        type: "text",
      };
    }

    // 5.1 PERSONAL DETAILS (age / dob / location)
    if (q.includes("blood group") || q.includes("blood")) {
      return {
        text: bloodGroup ? `Ashish's blood group is **${bloodGroup}**.` : "I do not have blood group details right now.",
        type: "text",
      };
    }

    // 5.2 PERSONAL DETAILS (age / dob / location)
    if (
      q.includes("age") ||
      q.includes("old are") ||
      q.includes("date of birth") ||
      q.includes("dob") ||
      q.includes("birthday") ||
      q.includes("where") ||
      q.includes("location")
    ) {
      const ageLine = computedAge !== null ? `He is **${computedAge}** years old.` : "";
      const dobLine = dob ? `Date of birth: **${dob}**.` : "";
      const locationLine = `Location: **${PERSONAL_INFO.location}**.`;
      return {
        text: [ageLine, dobLine, locationLine].filter(Boolean).join(" "),
        type: "text",
      };
    }

    // 5.3 EXPERIENCE YEARS (with typo-friendly checks)
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

    // 6. SKILLS
    if (q.includes("skill") || q.includes("tools") || q.includes("technology") || q.includes("tech stack")) {
      return {
        text: `Here are Ashish's core skills:\n${skillsSummary}`,
        type: "text",
      };
    }

    // 7. EXPERIENCE
    if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("career")) {
      return {
        text: `Ashish's recent experience includes:\n${experienceSummary}`,
        type: "text",
      };
    }

    // 8. EDUCATION
    if (q.includes("education") || q.includes("study") || q.includes("college") || q.includes("degree")) {
      return {
        text: `Ashish's education background:\n${educationSummary}`,
        type: "text",
      };
    }

    // 9. PROJECTS
    if (q.includes("project") || q.includes("dashboard")) {
      return { 
        text: `Here are a few featured projects by Ashish:\n${topProjects}`,
        type: "project-preview",
        data: PROJECTS[0]
      };
    }

    // DEFAULT FALLBACK
    return { 
      text: "I can help with **skills**, **projects**, **experience**, **education**, **contact details**, or **resume download**. Try asking a specific question about Ashish.",
      type: "text" 
    };
  };

  const ip = getClientIp(req);
  if (await isRateLimitedForRequest(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let message = "";
  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413 }
      );
    }

    const parsed = JSON.parse(rawBody) as { message?: unknown };
    if (typeof parsed.message !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload. 'message' must be a string." },
        { status: 400 }
      );
    }

    message = parsed.message.trim();
    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message is too long. Max ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    if (!apiKey) throw new Error("No API Key");

    // --- 1. PREPARE DATA FOR AI ---
    // (This was missing in your code!)
    const portfolioData = {
      personal: PERSONAL_INFO,
      skills: SKILLS,
      experience: EXPERIENCE,
      projects: PROJECTS,
      education: EDUCATION
    };

    // --- 2. SETUP AI ---
    const genAI = new GoogleGenerativeAI(apiKey);
    // using gemini-1.5-flash is faster and cheaper than pro, but pro is fine too
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- 3. THE PROMPT ---
    const systemPrompt = `
    You are Riya, the AI Manager for Ashish Singh.
    Tone: Professional, enthusiastic, and concise.

    Rules:
    1. **Formatting:** ALWAYS use Markdown. Use **bold** for key skills.
    2. **Links:** When mentioning a project, ALWAYS format it as a clickable link like this: [Project Name](URL).
    3. **Length:** Keep responses short (under 3 sentences) unless asked for details.
    4. If the user asks about skills, experience, education, contact info, or projects, answer directly from the provided portfolio data instead of giving a generic help message.
    4. **Special Actions:**
       - If the user explicitly asks to "schedule a meeting" or "book a call", add the text "[TYPE:CALENDAR]" at the end of your response.
       - If the user asks for "social media", add "[TYPE:SOCIALS]" at the end.

    Here is Ashish's Data:
    ${JSON.stringify(portfolioData)}
    `;

    // --- 4. GENERATE RESPONSE ---
    const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
    const response = await result.response;
    let text = response.text();
    let type = "text";

    // --- 5. PARSE HIDDEN COMMANDS ---
    if (text.includes("[TYPE:CALENDAR]")) {
      type = "calendar";
      text = text.replace("[TYPE:CALENDAR]", "");
    } else if (text.includes("[TYPE:SOCIALS]")) {
      type = "socials";
      text = text.replace("[TYPE:SOCIALS]", "");
    }

    return NextResponse.json({ reply: text.trim(), type: type });

  } catch (error) {
    console.error("⚠️ AI Switch to Backup:", error);
    // If API fails, use the internal brain
    const backup = getBackupResponse(message);
    return NextResponse.json({ 
      reply: backup.text, 
      type: backup.type,
      data: backup.data
    });
  }
}
