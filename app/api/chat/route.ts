import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getBackupResponse } from "@/lib/chat-backup";
import { getPortfolioContextForChat } from "@/lib/chat-portfolio-context";
import { formatHistoryForPrompt, parseChatHistory } from "@/lib/chat-history";

const MAX_MESSAGE_LENGTH = 600;
const MAX_BODY_LENGTH = 12_000;
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
  const ip = getClientIp(req);
  if (await isRateLimitedForRequest(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let message = "";
  let history = parseChatHistory([]);

  try {
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return NextResponse.json(
        { error: "Request body is too large." },
        { status: 413 }
      );
    }

    const parsed = JSON.parse(rawBody) as { message?: unknown; history?: unknown };
    if (typeof parsed.message !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload. 'message' must be a string." },
        { status: 400 }
      );
    }

    message = parsed.message.trim();
    history = parseChatHistory(parsed.history);

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

    const portfolioData = getPortfolioContextForChat();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const historyBlock = formatHistoryForPrompt(history);
    const conversationPrefix = historyBlock
      ? `Previous conversation (for context only):\n${historyBlock}\n\n`
      : "";

    const systemPrompt = `
    You are Riya, the AI Manager for Ashish Singh.
    Tone: Professional, enthusiastic, and concise.

    Rules:
    1. **Formatting:** ALWAYS use Markdown. Use **bold** for key skills.
    2. **Links:** When mentioning a project, ALWAYS format it as a clickable link like this: [Project Name](URL).
    3. **Length:** Keep responses short (under 3 sentences) unless asked for details.
    4. If the user asks about skills, experience, education, contact info, or projects, answer directly from the provided portfolio data instead of giving a generic help message.
    5. Never share date of birth, age, blood group, or other private personal details. Redirect to professional topics.
    6. Use the previous conversation when the user refers to earlier messages (e.g. "the second project", "tell me more").
    7. **Special Actions:**
       - If the user explicitly asks to "schedule a meeting" or "book a call", add the text "[TYPE:CALENDAR]" at the end of your response.
       - If the user asks for "social media", add "[TYPE:SOCIALS]" at the end.

    Here is Ashish's Data:
    ${JSON.stringify(portfolioData)}
    `;

    const result = await model.generateContent(
      `${systemPrompt}\n\n${conversationPrefix}User Question: ${message}`
    );
    const response = await result.response;
    let text = response.text();
    let type = "text";

    if (text.includes("[TYPE:CALENDAR]")) {
      type = "calendar";
      text = text.replace("[TYPE:CALENDAR]", "");
    } else if (text.includes("[TYPE:SOCIALS]")) {
      type = "socials";
      text = text.replace("[TYPE:SOCIALS]", "");
    }

    return NextResponse.json({ reply: text.trim(), type });
  } catch (error) {
    console.error("⚠️ AI Switch to Backup:", error);
    const backup = getBackupResponse(message);
    return NextResponse.json({
      reply: backup.text,
      type: backup.type,
      data: backup.data,
    });
  }
}
