"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Trash2, Download, Mail, Phone, Sparkles, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { PERSONAL_INFO, RESUME_FILE } from "../../lib/data";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  type?: "text" | "calendar" | "resume" | "socials" | "project-preview";
  time: string;
};

const SUGGESTED_ACTIONS = [
  "Show me your projects",
  "What are your skills?",
  "Tell me about your experience",
  "Download Resume",
  "Contact Info",
];

const PHONE_LINK = `tel:${PERSONAL_INFO.phone.replace(/\s+/g, "")}`;
const SOCIAL_NAMES = new Set(["LinkedIn", "GitHub", "Instagram", "WhatsApp"]);

const CHAT_STORAGE_KEY = "portfolio_chat_history_v2";
const MAX_STORED_MESSAGES = 60;
const CHAT_WELCOME_TEXT =
  "Hi! I am Riya, Ashish's portfolio assistant.\n\nI can help with **projects**, **skills**, **experience**, **contact**, and **resume**.";

function makeId(): string {
  // Prefer stable unique ids for React keys + persistence.
  // `crypto.randomUUID()` exists in modern browsers.
  try {
    const cryptoObj = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function getWelcomeMessage(): ChatMessage {
  return {
    id: makeId(),
    role: "bot",
    text: CHAT_WELCOME_TEXT,
    type: "text",
    time: getCurrentTime(),
  };
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage()]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  useEffect(() => {
    // Load persisted chat history once (client only).
    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;

      const cleaned: ChatMessage[] = parsed
        .filter((m) => m && typeof m === "object")
        .map((m) => m as Partial<ChatMessage>)
        .filter((m) => (m.role === "user" || m.role === "bot") && typeof m.text === "string" && typeof m.time === "string")
        .map((m) => ({
          id: typeof m.id === "string" && m.id.length ? m.id : makeId(),
          role: m.role as ChatMessage["role"],
          text: m.text as string,
          type: m.type as ChatMessage["type"],
          time: m.time as string,
        }))
        .slice(-MAX_STORED_MESSAGES);

      if (!cleaned.length) return;
      setMessages(cleaned);
    } catch {
      // ignore storage issues
    }
  }, []);


  useEffect(() => {
    // Persist messages (best effort). Keep it lightweight.
    try {
      const payload = messages.slice(-MAX_STORED_MESSAGES);
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage issues
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      openButtonRef.current?.focus();
    }
  }, [isOpen]);

  const clearChat = () => {
    const reset = getWelcomeMessage();
    setMessages([reset]);
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([reset]));
    } catch {
      // ignore
    }
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: makeId(), role: "user", text: trimmed, time: getCurrentTime() }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${window.location.origin}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { reply: string; type?: ChatMessage["type"] };
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "bot", text: data.reply, type: data.type ?? "text", time: getCurrentTime() },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "bot",
          text: "I could not reach the assistant service right now. You can still contact Ashish directly by email or phone from the Contact section.",
          type: "text",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat assistant"
        className="fixed bottom-3 right-3 z-50 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-violet-700 shadow-lg shadow-violet-200/60 transition hover:-translate-y-0.5 hover:bg-violet-50 dark:border-violet-500/40 dark:bg-zinc-900 dark:text-violet-200 dark:shadow-black/40 sm:bottom-6 sm:right-6 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
      >
        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Chat
      </button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-[1px]"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat overlay"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.99, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.7 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chatbot-title"
              ref={dialogRef}
              className="fixed inset-x-0 bottom-0 top-16 z-[60] flex h-[calc(100dvh-4rem)] flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-zinc-900 sm:inset-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[680px] sm:w-[420px] sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/15 bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 px-3 py-2.5 text-white sm:px-4 sm:py-3">
                <div className="min-w-0">
                  <p id="chatbot-title" className="truncate text-xs font-bold tracking-wide sm:text-sm">
                    Riya - Portfolio Assistant
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-violet-100 sm:text-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Online
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={clearChat}
                    className="rounded-full p-2 transition hover:bg-white/15"
                    title="Reset chat"
                    aria-label="Reset chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 transition hover:bg-white/15"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-3 dark:from-zinc-950 dark:to-zinc-900 sm:space-y-3 sm:p-4">
                {messages.map((message, index) => {
                  const prev = messages[index - 1];
                  const isGrouped = Boolean(prev && prev.role === message.role);
                  const showLabel = message.role === "bot" && !isGrouped;
                  const showTime = !isGrouped;

                  return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[90%] ${message.role === "bot" ? "sm:max-w-[88%]" : "sm:max-w-[80%]"}`}>
                      {showLabel ? (
                        <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Riya</p>
                      ) : null}

                      <div
                        className={`rounded-2xl px-3 py-2.5 text-[13px] shadow-sm sm:px-3.5 sm:py-3 sm:text-sm ${
                          message.role === "user"
                            ? "rounded-br-md bg-violet-600 text-white"
                            : "rounded-bl-md border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none break-words dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              a: ({ ...props }) => (
                                <a
                                  {...props}
                                  className="font-medium text-violet-600 underline hover:text-violet-500 dark:text-violet-300 dark:hover:text-violet-200"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                              strong: ({ ...props }) => <strong {...props} className="font-semibold" />,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>

                        {message.type === "calendar" ? (
                          <div className="mt-3 grid gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                            <a
                              href={`mailto:${PERSONAL_INFO.email}?subject=Meeting%20Request`}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              Send Email Invite
                            </a>
                            <a
                              href={PHONE_LINK}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              Call Now
                            </a>
                          </div>
                        ) : null}

                        {message.type === "socials" ? (
                          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                              {PERSONAL_INFO.socials.filter((social) => SOCIAL_NAMES.has(social.name)).map((social) => (
                                <a
                                  key={social.name}
                                  href={social.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={social.name}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-950/35 dark:text-violet-200 dark:hover:bg-violet-950/55"
                                >
                                  <social.icon className="h-3.5 w-3.5" />
                                  {social.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {message.type === "resume" ? (
                          <a
                            href={RESUME_FILE}
                            download
                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-950/30 dark:text-violet-200"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Resume
                          </a>
                        ) : null}
                      </div>

                      {showTime ? <p className="mt-1 px-1 text-[10px] text-gray-400">{message.time.toLowerCase()}</p> : null}
                    </div>
                  </motion.div>
                  );
                })}

                {isTyping ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-300"
                    role="status"
                  >
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 [animation-delay:120ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 [animation-delay:240ms]" />
                    Riya is typing...
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 bg-white px-2.5 py-2 dark:border-gray-800 dark:bg-zinc-900 sm:px-3">
                <div className="mb-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SUGGESTED_ACTIONS.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSend(action)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[10px] font-medium text-gray-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/40 dark:hover:text-violet-200 sm:px-3 sm:text-[11px]"
                    >
                      <Sparkles className="h-3 w-3" />
                      {action}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-zinc-800 sm:p-1.5">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend(input);
                      }
                    }}
                    className="flex-1 bg-transparent px-2 py-1.5 text-[13px] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:px-2.5 sm:py-2 sm:text-sm"
                    placeholder="Ask about projects, experience, or contact..."
                  />
                  <button
                    type="button"
                    onClick={() => handleSend(input)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-60 sm:h-10 sm:w-10"
                    aria-label="Send message"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
