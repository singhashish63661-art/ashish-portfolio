"use client";

import { useState } from "react";
import { PERSONAL_INFO } from "../../lib/data";
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, MapPin, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WA_LINK = "https://wa.me/917206617045";
const PHONE_LINK = `tel:${PERSONAL_INFO.phone.replace(/\s+/g, "")}`;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/meoyzrbj", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        trackEvent("contact_submit_failed", { status: response.status });
        setError("The message could not be sent right now. Please try again in a moment.");
        return;
      }

      trackEvent("contact_submit_success", { subject: subject || "general" });
      setSuccess(true);
      form.reset();
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (submitError) {
      trackEvent("contact_submit_failed", { status: "network_error" });
      console.error("Contact form submission failed:", submitError);
      setError("A network issue prevented the message from sending. Please try again or use email directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 snap-start bg-violet-50/50 py-20 sm:py-28 dark:bg-zinc-900/50">
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Contact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Let&apos;s Work Together</h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            Tell me about your project, goals, and timeline. If helpful, include budget range and current blockers.
          </p>
          <p className="mt-2 text-sm font-medium text-violet-700 dark:text-violet-300">Typical response time: within 24 hours.</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="space-y-4">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="flex items-start gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</p>
                <p className="mt-1 break-all font-semibold text-gray-900 dark:text-white">{PERSONAL_INFO.email}</p>
              </div>
            </a>

            <a
              href={PHONE_LINK}
              className="flex items-start gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">{PERSONAL_INFO.phone}</p>
              </div>
            </a>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">WhatsApp</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">Message on WhatsApp</p>
              </div>
            </a>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
            >
              <Mail className="h-4 w-4" />
              Email Me Directly
            </a>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-zinc-950 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {loading ? "Sending..." : "Send message"}
              </button>

              {success ? (
                <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Thanks! Your message has been sent.
                </p>
              ) : null}

              {error ? (
                <p className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">{PERSONAL_INFO.location}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Current office — open to remote collaboration across India.
                </p>
              </div>
            </div>
            <a
              href={PERSONAL_INFO.map.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("contact_map_open", { source: "embed_header" })}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-950"
            >
              Open in Maps
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-zinc-900 sm:aspect-[21/9] sm:min-h-[260px]">
            <iframe
              title={`Map showing ${PERSONAL_INFO.location}`}
              src={PERSONAL_INFO.map.embedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
