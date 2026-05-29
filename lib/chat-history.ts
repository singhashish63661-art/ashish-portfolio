export const MAX_HISTORY_TURNS = 8;
export const MAX_HISTORY_CONTENT_LENGTH = 400;

export type ChatHistoryTurn = {
  role: "user" | "assistant";
  content: string;
};

export function parseChatHistory(raw: unknown): ChatHistoryTurn[] {
  if (!Array.isArray(raw)) return [];

  const turns: ChatHistoryTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;

    const trimmed = content.trim();
    if (!trimmed) continue;

    turns.push({
      role,
      content: trimmed.slice(0, MAX_HISTORY_CONTENT_LENGTH),
    });
  }

  return turns.slice(-MAX_HISTORY_TURNS);
}

export function formatHistoryForPrompt(history: ChatHistoryTurn[]): string {
  if (!history.length) return "";

  return history
    .map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`)
    .join("\n");
}
