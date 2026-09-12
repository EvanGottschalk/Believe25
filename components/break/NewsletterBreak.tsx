"use client";

import { useState } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { CONTENT } from "@/config/content";
import { FORMS } from "@/config/forms";
import { cn, isValidEmail } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterBreak() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const copy = CONTENT.newsletter;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage(copy.invalidEmail);
      return;
    }

    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch(FORMS.endpoints.newsletter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
      setMessage(copy.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(copy.error);
    }
  }

  return (
    <SectionShell ground="deep" size="break">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-display-md text-on-deep">{copy.heading}</h2>
        <p className="mt-3 font-body text-sm text-on-deep-muted">{copy.body}</p>

        <form onSubmit={onSubmit} className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            {copy.placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={copy.placeholder}
            aria-invalid={status === "error"}
            aria-describedby={message ? "newsletter-message" : undefined}
            disabled={status === "submitting"}
            className={cn(
              "min-h-[48px] flex-1 rounded-pill border bg-transparent px-5 font-body text-sm text-on-deep",
              "placeholder:text-on-deep-muted/70 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft",
              status === "error" ? "border-primary" : "border-on-deep/25 focus:border-on-deep/50",
            )}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "min-h-[48px] shrink-0 rounded-pill bg-on-deep px-8 font-body text-sm font-medium text-surface-deep",
              "transition-colors duration-300 hover:bg-primary hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep",
              "disabled:opacity-50",
            )}
          >
            {status === "submitting" ? copy.submitting : copy.submit}
          </button>
        </form>

        <p
          id="newsletter-message"
          role={status === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 min-h-[1.25rem] font-body text-sm",
            status === "error" ? "text-primary-soft" : "text-on-deep-muted",
          )}
        >
          {message ?? copy.consent}
        </p>
      </Reveal>
    </SectionShell>
  );
}
