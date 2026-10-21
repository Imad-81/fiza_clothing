"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.data?.message ?? "Thanks for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5F4] via-[#F8ECE9] to-[#F2DDD9] texture-grain">
      {/* Ambient rose gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5C0BA]/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Couture frame */}
        <div className="relative border border-[#C9968F]/35 bg-white/40 px-6 py-14 shadow-xs backdrop-blur-xs sm:px-12 sm:py-20">
          <span
            aria-hidden="true"
            className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8ECE9] px-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[#9A564E]"
          >
            N° 03 — Correspondence
          </span>

          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#9A564E]">
              ✦&nbsp;&nbsp;The Style By Fiza Circle&nbsp;&nbsp;✦
            </p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-[#1F191B] sm:text-5xl">
              Join the{" "}
              <span className="font-serif italic text-[#A85A50]">
                inner circle
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md font-serif text-lg italic leading-relaxed text-[#3B2F31]/75">
              Early access to new drops, private offers and boutique styling notes —
              never more than once a week.
            </p>

            {status === "success" ? (
              <div className="mx-auto mt-10 max-w-md border border-[#C9968F]/40 bg-[#E5C0BA]/20 px-6 py-5">
                <p className="font-serif text-lg italic text-[#8C4E46]">
                  {message}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="relative flex-1 text-left">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setMessage("");
                      }
                    }}
                    placeholder="Your email address"
                    disabled={status === "loading"}
                    className="w-full border-b border-[#2B2325]/30 bg-transparent px-1 py-3 font-serif text-lg italic text-[#1F191B] placeholder-[#2B2325]/40 outline-none transition-colors focus:border-[#A85A50] disabled:opacity-50"
                  />
                  {status === "error" && message && (
                    <p className="absolute -bottom-6 left-1 text-xs text-rose-700">
                      {message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 rounded-full bg-[#1F191B] px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#FAF5F4] transition-colors hover:bg-[#E5C0BA] hover:text-[#1F191B] disabled:opacity-50"
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
