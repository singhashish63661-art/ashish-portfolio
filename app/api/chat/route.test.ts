import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/chat", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    const store = (globalThis as typeof globalThis & { __chatRateLimitStore?: Map<string, unknown> })
      .__chatRateLimitStore;
    store?.clear();
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid-json",
    });

    const res = await POST(req);
    const body = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(body.error).toContain("Invalid JSON");
  });

  it("returns 400 when message is missing", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message exceeds max length", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "a".repeat(601) }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns backup response when AI key is not configured", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Tell me about projects" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { reply: string; type: string };

    expect(res.status).toBe(200);
    expect(typeof body.reply).toBe("string");
    expect(body.type).toBeDefined();
  });

  it("does not reveal blood group in backup responses", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "what is ashish blood group?" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { reply: string; type: string };

    expect(res.status).toBe(200);
    expect(body.reply).not.toContain("O+");
    expect(body.reply.toLowerCase()).toMatch(/skills|projects|contact|resume/);
    expect(body.type).toBe("text");
  });

  it("returns project-preview with featured project data", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "show me your projects" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { reply: string; type: string; data?: { slug: string } };

    expect(res.status).toBe(200);
    expect(body.type).toBe("project-preview");
    expect(body.data?.slug).toBeDefined();
  });

  it("answers years of experience for typoed query", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "year of exprence" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { reply: string; type: string };

    expect(res.status).toBe(200);
    expect(body.reply.toLowerCase()).toContain("years");
    expect(body.reply.toLowerCase()).toContain("experience");
    expect(body.type).toBe("text");
  });

  it("answers social links for typoed LinkedIn profile query", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ashish linkind profile" }),
    });

    const res = await POST(req);
    const body = (await res.json()) as { reply: string; type: string };

    expect(res.status).toBe(200);
    expect(body.reply).toContain("LinkedIn");
    expect(body.reply).toContain("GitHub");
    expect(body.type).toBe("socials");
  });

  it("accepts optional conversation history in the payload", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "tell me more",
        history: [
          { role: "user", content: "show projects" },
          { role: "assistant", content: "Here are featured projects." },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 429 after crossing rate limit in the same window", async () => {
    let latestStatus = 200;

    for (let index = 0; index < 21; index += 1) {
      const req = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({ message: "hello" }),
      });

      const res = await POST(req);
      latestStatus = res.status;
    }

    expect(latestStatus).toBe(429);
  });
});
