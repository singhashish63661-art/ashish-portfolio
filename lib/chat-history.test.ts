import { describe, expect, it } from "vitest";
import { formatHistoryForPrompt, parseChatHistory } from "./chat-history";

describe("parseChatHistory", () => {
  it("returns empty array for invalid input", () => {
    expect(parseChatHistory(null)).toEqual([]);
    expect(parseChatHistory("string")).toEqual([]);
  });

  it("keeps valid turns and trims to max length", () => {
    const turns = parseChatHistory([
      { role: "user", content: "  hello  " },
      { role: "assistant", content: "Hi there" },
      { role: "invalid", content: "skip" },
      { role: "user", content: "" },
    ]);

    expect(turns).toEqual([
      { role: "user", content: "hello" },
      { role: "assistant", content: "Hi there" },
    ]);
  });
});

describe("formatHistoryForPrompt", () => {
  it("formats turns for the model prompt", () => {
    const formatted = formatHistoryForPrompt([
      { role: "user", content: "Show projects" },
      { role: "assistant", content: "Here are three projects." },
    ]);

    expect(formatted).toContain("User: Show projects");
    expect(formatted).toContain("Assistant: Here are three projects.");
  });
});
