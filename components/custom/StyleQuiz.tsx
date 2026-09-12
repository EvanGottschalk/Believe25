"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FORMS, type QuizQuestion } from "@/config/forms";
import { CONTENT } from "@/config/content";
import { COMMERCE } from "@/config/commerce";
import { EASE } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import { cn, isValidEmail } from "@/lib/utils";

type Answers = Record<string, string | string[]>;
const STORAGE_KEY = "believe25:customRequest";
const QUESTIONS = FORMS.quiz;
/** Questions plus the contact step. */
const TOTAL_STEPS = QUESTIONS.length + 1;

export function StyleQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotionSafe();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);

  /** Which product the visitor came from, if they used a Make it yours chip. */
  const fromProduct = searchParams.get("from");

  // Seed from the landing-page teaser and from a half-finished session, so
  // nothing already answered is asked again.
  useEffect(() => {
    const seeded: Answers = {};
    for (const question of QUESTIONS) {
      const value = searchParams.get(question.id);
      if (!value) continue;
      seeded[question.id] = question.type === "multi" ? value.split(",") : value;
    }

    let stored: { answers?: Answers; name?: string; email?: string } = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      /* ignore malformed state */
    }

    const merged = { ...(stored.answers ?? {}), ...seeded };
    setAnswers(merged);
    if (stored.name) setName(stored.name);
    if (stored.email) setEmail(stored.email);

    // Open on the first unanswered question.
    const firstGap = QUESTIONS.findIndex(
      (q) => !q.optional && !hasAnswer(merged[q.id]),
    );
    setStep(firstGap === -1 ? QUESTIONS.length : firstGap);
    setRestored(true);
    // Intentionally runs once — later param changes shouldn't reset progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist so a refresh doesn't lose the work.
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, name, email }));
    } catch {
      /* storage unavailable — the flow still works for this session */
    }
  }, [answers, name, email, restored]);

  const question: QuizQuestion | undefined = QUESTIONS[step];
  const onContactStep = step === QUESTIONS.length;

  const canAdvance = useMemo(() => {
    if (onContactStep) return name.trim().length > 0 && isValidEmail(email);
    if (!question) return false;
    return question.optional || hasAnswer(answers[question.id]);
  }, [onContactStep, question, answers, name, email]);

  function setAnswer(id: string, value: string, multi: boolean) {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [id]: value };
      const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      return {
        ...prev,
        [id]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(FORMS.endpoints.customRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, name, email, fromProduct }),
      });
      if (res.status === 429) throw new Error(FORMS.validation.rateLimited);
      if (!res.ok) throw new Error(FORMS.validation.serverError);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      router.push("/custom/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : FORMS.validation.serverError);
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between font-body text-xs text-foreground-muted">
          <span>{FORMS.customRequest.progressLabel(step + 1, TOTAL_STEPS)}</span>
          {COMMERCE.customDepositEnabled ? null : (
            <span className="text-accent">Free · no payment</span>
          )}
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-pill bg-surface"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Progress"
        >
          <div
            className="h-full rounded-pill bg-iridescent bg-[length:200%_100%] transition-[width] duration-500 ease-brand motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: reduced ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduced ? 0 : -20 }}
          transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
        >
          {onContactStep ? (
            <ContactStep
              name={name}
              email={email}
              onName={setName}
              onEmail={setEmail}
            />
          ) : question ? (
            <QuestionStep
              question={question}
              value={answers[question.id]}
              onChange={setAnswer}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p role="alert" className="mt-6 font-body text-sm text-primary">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center gap-4">
        {step > 0 && (
          <Button variant="secondary" size="md" onClick={() => setStep((s) => s - 1)}>
            {FORMS.customRequest.backLabel}
          </Button>
        )}
        {onContactStep ? (
          <Button
            variant="primary"
            size="lg"
            disabled={!canAdvance || submitting}
            onClick={submit}
          >
            {submitting ? FORMS.customRequest.submitting : FORMS.customRequest.submit}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
          >
            {question?.optional && !hasAnswer(answers[question.id])
              ? "Skip"
              : FORMS.customRequest.nextLabel}
          </Button>
        )}
      </div>

      <p className="mt-6 font-body text-sm text-foreground-muted">
        {CONTENT.custom.freeNote}
      </p>
    </div>
  );
}

function QuestionStep({
  question,
  value,
  onChange,
}: {
  question: QuizQuestion;
  value: string | string[] | undefined;
  onChange: (id: string, value: string, multi: boolean) => void;
}) {
  const multi = question.type === "multi";

  if (question.type === "text") {
    return (
      <div>
        <label htmlFor={question.id} className="font-display text-display-md">
          {question.question}
        </label>
        {question.help && (
          <p className="mt-2 font-body text-sm text-foreground-muted">{question.help}</p>
        )}
        <textarea
          id={question.id}
          rows={5}
          maxLength={question.maxLength}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(question.id, e.target.value, false)}
          className="mt-5 w-full rounded-lg border border-foreground/15 bg-background p-4 font-body text-base leading-relaxed transition-colors focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="font-display text-display-md">{question.question}</legend>
      {question.help && (
        <p className="mt-2 font-body text-sm text-foreground-muted">{question.help}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {question.options?.map((option) => {
          const active = multi
            ? Array.isArray(value) && value.includes(option.value)
            : value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(question.id, option.value, multi)}
              className={cn(
                "inline-flex min-h-[52px] items-center gap-3 rounded-pill border px-6 font-body",
                "transition-all duration-300 ease-brand",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                active
                  ? "border-accent bg-accent-soft/60 text-accent"
                  : "border-foreground/15 text-foreground hover:border-foreground/40",
              )}
            >
              {option.swatch && (
                <span className="flex -space-x-1.5" aria-hidden>
                  {option.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-5 w-5 rounded-pill border-2 border-background"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
              )}
              <span>
                {option.label}
                {option.hint && (
                  <span className="ml-2 text-xs text-foreground-muted">{option.hint}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Contact details are asked last, once the visitor is already invested. */
function ContactStep({
  name,
  email,
  onName,
  onEmail,
}: {
  name: string;
  email: string;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
}) {
  const f = FORMS.contactFields;
  return (
    <div>
      <h2 className="font-display text-display-md">Where should I send it?</h2>
      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="font-body text-sm font-medium">
            {f.nameLabel}
          </label>
          <input
            id="name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder={f.namePlaceholder}
            className="mt-2 min-h-[48px] w-full rounded-pill border border-foreground/15 bg-background px-5 font-body transition-colors focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-body text-sm font-medium">
            {f.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder={f.emailPlaceholder}
            className="mt-2 min-h-[48px] w-full rounded-pill border border-foreground/15 bg-background px-5 font-body transition-colors focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <p className="mt-2 font-body text-xs text-foreground-muted">{f.consentLabel}</p>
        </div>
      </div>
    </div>
  );
}

function hasAnswer(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}
