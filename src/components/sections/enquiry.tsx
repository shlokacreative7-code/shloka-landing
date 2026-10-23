"use client";

import { ArrowLeft, ArrowRight, Check, CornerDownLeft, LoaderCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { flowLabels, flows, intentQuestion, type Flow, type Question } from "@/content/enquiry";
import { enquiryPoints } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ArchProgress } from "@/components/enquiry/arch-progress";
import { Ticket, type TicketRow } from "@/components/enquiry/ticket";
import { Button } from "@/components/ui/button";
import { easeOutExpo, Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TickList } from "@/components/ui/tick-list";
import { DoodleField, type DoodleSpot } from "@/components/visuals/doodles";

/**
 * Enquiries are delivered by Web3Forms (free), which emails each submission to the
 * address the access key was created with. The key is designed to be public. See README.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const PHONE = /^\+?[0-9\s\-()]{8,20}$/;
const EMAIL = /^\S+@\S+\.\S+$/;

type Answers = Record<string, string | string[]>;
type Contact = { name: string; phone: string; email: string; message: string; consent: boolean };
const emptyContact: Contact = { name: "", phone: "", email: "", message: "", consent: false };

const doodles: DoodleSpot[] = [
  { name: "phone", x: "3%", y: "8%", size: 60, rotate: -10 },
  { name: "heartPulse", x: "90%", y: "4%", size: 50, rotate: 8, delay: 2 },
  { name: "calendar", x: "94%", y: "88%", size: 44, rotate: 6, delay: 4 },
];

// Questions slide up when moving forward and down when going back.
const slide = {
  enter: (direction: number) => ({ opacity: 0, y: direction * 48, filter: "blur(8px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({ opacity: 0, y: direction * -48, filter: "blur(8px)" }),
};

const asText = (value: string | string[] | undefined) => (Array.isArray(value) ? value.join(", ") : (value ?? "")).trim();

const fieldClass =
  "w-full min-h-14 rounded-2xl border-[1.5px] border-white/25 bg-white/[0.06] px-4 py-3.5 text-[1.0625rem] text-white transition-[border-color,box-shadow] placeholder:text-white/40 hover:border-white/45 focus:border-gold focus:shadow-[0_0_0_4px_rgb(201_162_39/0.25)] focus:outline-none focus-visible:outline-none";

export function Enquiry() {
  const reduce = useReducedMotion();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [problem, setProblem] = useState<string | null>(null);
  const [status, setStatus] = useState<"editing" | "sending" | "sent">("editing");
  const honeypot = useRef<HTMLInputElement>(null);
  const advance = useRef<number | undefined>(undefined);
  const moved = useRef(false);

  const steps = [intentQuestion, ...flows[flow ?? "family"]];
  const step = steps[index]!;
  const total = steps.length;

  // Focus each new question as it appears (not on page load), so screen readers announce it and
  // number keys keep working. A callback ref, because the old question is still animating out
  // when the step changes.
  const heading = useCallback((node: HTMLHeadingElement | null) => {
    if (node && moved.current) node.focus({ preventScroll: true });
  }, []);
  useEffect(() => () => window.clearTimeout(advance.current), []);

  function goTo(nextIndex: number, dir: number) {
    moved.current = true;
    setProblem(null);
    setDirection(dir);
    setIndex(nextIndex);
  }

  function validate(question: Question): string | null {
    switch (question.kind) {
      case "choice":
        return answers[question.id] ? null : "Please choose one of the options.";
      case "multi":
        return asText(answers[question.id]) ? null : "Please choose at least one.";
      case "text":
        return question.required && !asText(answers[question.id]) ? "Please fill this in to continue." : null;
      case "contact":
        if (!contact.name.trim()) return "Please tell us your name.";
        if (!PHONE.test(contact.phone.trim()))
          return "Please enter a phone number we can call or WhatsApp. Add your country code if you’re outside India.";
        if (contact.email.trim() && !EMAIL.test(contact.email.trim())) return "That email address doesn’t look right. You can also leave it empty.";
        if (!contact.consent) return "Please tick the box so we can get in touch.";
        return null;
    }
  }

  function next() {
    const issue = validate(step);
    if (issue) {
      setProblem(issue);
      return;
    }
    if (step.kind === "contact") void send();
    else goTo(index + 1, 1);
  }

  function choose(question: Question, value: string) {
    setProblem(null);
    if (question.id === intentQuestion.id && value !== flow) {
      // A new path starts a fresh set of answers.
      setFlow(value as Flow);
      setAnswers({ [question.id]: value });
    } else {
      setAnswers((current) => ({ ...current, [question.id]: value }));
    }
    // Single choices move on by themselves, after a beat so the selection registers.
    window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => goTo(index + 1, 1), reduce ? 0 : 380);
  }

  function toggle(question: Question, value: string) {
    setProblem(null);
    setAnswers((current) => {
      const chosen = Array.isArray(current[question.id]) ? (current[question.id] as string[]) : [];
      return { ...current, [question.id]: chosen.includes(value) ? chosen.filter((item) => item !== value) : [...chosen, value] };
    });
  }

  // Number keys pick options on choice screens, as the badges on each option suggest.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (status !== "editing" || step.kind !== "choice") return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const option = step.options[Number(event.key) - 1];
    if (option) {
      event.preventDefault();
      choose(step, option.value);
    }
  }

  async function send() {
    // Bots tick the hidden box. Pretend all is well and drop the submission.
    if (honeypot.current?.checked) {
      setStatus("sent");
      return;
    }
    if (!WEB3FORMS_KEY) {
      console.warn("NEXT_PUBLIC_WEB3FORMS_KEY is not set, so the enquiry form can't send. See README.");
      setProblem("Sorry, this form isn’t connected yet. Please try again soon.");
      return;
    }
    const path = flow ?? "family";
    const name = contact.name.trim();
    const answered = Object.fromEntries(
      flows[path].filter((q) => q.kind !== "contact").map((q) => [q.id, asText(answers[q.id])]).filter(([, value]) => value),
    );

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry from ${name} (${flowLabels[path]})`,
          from_name: `${site.name} website`,
          enquiring_as: flowLabels[path],
          ...answered,
          name,
          phone: contact.phone.trim(),
          ...(contact.email.trim() && { email: contact.email.trim() }),
          ...(contact.message.trim() && { message: contact.message.trim() }),
          consent: "Agreed to be contacted by call or WhatsApp",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!response.ok || !body.success) throw new Error(body.message ?? `HTTP ${response.status}`);
      moved.current = true;
      setStatus("sent");
    } catch (error) {
      console.error("Enquiry failed:", error);
      setStatus("editing");
      setProblem("We couldn’t send your request. Please check your connection and try again.");
    }
  }

  function restart() {
    moved.current = true;
    setFlow(null);
    setAnswers({});
    setContact(emptyContact);
    setProblem(null);
    setDirection(-1);
    setIndex(0);
    setStatus("editing");
  }

  const ticketRows: TicketRow[] = [
    { label: intentQuestion.ticketLabel, value: flow ? flowLabels[flow] : "" },
    ...flows[flow ?? "family"]
      .filter((q) => q.kind !== "contact")
      .map((q) => ({ label: q.ticketLabel, value: asText(answers[q.id]) })),
    { label: "Name", value: contact.name.trim() },
    { label: "Phone", value: contact.phone.trim() },
  ];
  const activeLabel = step.kind === "contact" ? "Name" : step.ticketLabel;
  const sent = status === "sent";

  return (
    <section id="enquire" aria-labelledby="enquire-title" className="relative isolate bg-canvas-soft py-section">
      <DoodleField spots={doodles} className="text-ink/[0.08]" />
      <div className="container-x">
        <SectionHeading
          id="enquire-title"
          eyebrow="Enquire"
          title="Tell us [what you need.]"
          description="We’re opening in Lucknow with a small group of families first. Answer a few quick questions and we’ll call or WhatsApp you."
        />

        <Reveal y={40}>
          <div className="on-dark relative isolate overflow-hidden rounded-[2.5rem] bg-band p-6 text-white/80 shadow-[0_50px_120px_-50px_rgb(11_31_58/0.8)] ring-1 ring-gold/20 sm:p-10 lg:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[30rem] rounded-full bg-gold/12 blur-[110px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -bottom-48 -z-10 size-[28rem] rounded-full bg-gold/8 blur-[120px]" />

            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
              <div onKeyDown={onKeyDown} className="flex min-h-[32rem] flex-col">
                <div className="flex items-center gap-4">
                  <ArchProgress step={index} total={total} done={sent} />
                  <div className="leading-snug" aria-live="polite">
                    <p className="text-sm font-bold tracking-[0.16em] text-gold uppercase">
                      {sent ? "Request sent" : `Step ${index + 1} of ${total}`}
                    </p>
                    <p className="text-white/60">{sent ? "We’ll be in touch soon" : flow ? flowLabels[flow] : "About a minute"}</p>
                  </div>
                </div>

                <div className="relative mt-10 flex-1">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={sent ? "sent" : index === 0 ? "start" : `${flow}-${index}`}
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: easeOutExpo }}
                    >
                      {sent ? (
                        <Success name={contact.name} phone={contact.phone} headingRef={heading} onRestart={restart} />
                      ) : (
                        <form
                          noValidate
                          onSubmit={(event: FormEvent) => {
                            event.preventDefault();
                            next();
                          }}
                        >
                          <h3
                            ref={heading}
                            tabIndex={-1}
                            id="enquiry-question"
                            className="font-serif text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.04] font-normal text-white focus:outline-none"
                          >
                            {step.title}
                          </h3>
                          {step.subtitle && <p className="mt-3 text-lead text-white/65">{step.subtitle}</p>}

                          <div className="mt-8">
                            <StepBody
                              step={step}
                              answers={answers}
                              contact={contact}
                              setContact={setContact}
                              honeypot={honeypot}
                              onChoose={choose}
                              onToggle={toggle}
                              onText={(question, value) => {
                                setProblem(null);
                                setAnswers((current) => ({ ...current, [question.id]: value }));
                              }}
                            />
                          </div>

                          <p role="alert" className="mt-5 font-semibold text-[#f6b8ae] empty:hidden">
                            {problem}
                          </p>

                          <div className="mt-8 flex flex-wrap items-center gap-3">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => goTo(index - 1, -1)}
                                className="inline-flex min-h-[3.5rem] items-center gap-2 rounded-full border-[1.5px] border-white/25 px-6 font-bold text-white transition-colors hover:border-white"
                              >
                                <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2} />
                                Back
                              </button>
                            )}
                            {(step.kind !== "choice" || answers[step.id]) && (
                              <Button
                                type="submit"
                                size="md"
                                arrow={status !== "sending"}
                                disabled={status === "sending"}
                                className="bg-gold text-navy"
                              >
                                {status === "sending" && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
                                {step.kind === "contact" ? (status === "sending" ? "Sending…" : "Send my request") : "Continue"}
                              </Button>
                            )}
                            {step.kind !== "contact" && (
                              <span className="hidden items-center gap-1.5 text-sm text-white/50 sm:inline-flex">
                                {step.kind === "choice" ? "Press a number to choose" : "or press Enter"}
                                <CornerDownLeft aria-hidden="true" className="size-4" />
                              </span>
                            )}
                          </div>
                        </form>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="lg:pt-2">
                <Ticket rows={ticketRows} activeLabel={activeLabel} sent={sent} />
              </div>
            </div>
          </div>
        </Reveal>

        <TickList items={enquiryPoints} className="mt-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10" />
      </div>
    </section>
  );
}

function StepBody({
  step,
  answers,
  contact,
  setContact,
  honeypot,
  onChoose,
  onToggle,
  onText,
}: {
  step: Question;
  answers: Answers;
  contact: Contact;
  setContact: (update: (current: Contact) => Contact) => void;
  honeypot: RefObject<HTMLInputElement | null>;
  onChoose: (question: Question, value: string) => void;
  onToggle: (question: Question, value: string) => void;
  onText: (question: Question, value: string) => void;
}) {
  if (step.kind === "choice" && step.layout === "tiles") {
    return (
      <div role="group" aria-labelledby="enquiry-question" className="grid gap-3 sm:grid-cols-2">
        {step.options.map((option, i) => {
          const selected = answers[step.id] === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChoose(step, option.value)}
              className={cn(
                "group relative flex min-h-28 flex-col justify-end overflow-hidden rounded-3xl border-[1.5px] p-4 text-left transition-[border-color,background-color,transform] duration-300 active:scale-[0.98]",
                selected ? "border-gold bg-gold/15" : "border-white/15 bg-white/[0.04] hover:border-gold/60 hover:bg-white/[0.07]",
              )}
            >
              {option.image ? (
                <span className="mb-2 block overflow-hidden rounded-2xl bg-ivory">
                  <Image src={option.image} alt="" width={320} height={230} className="h-28 w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </span>
              ) : (
                <Sparkles aria-hidden="true" className="mb-3 size-8 text-gold" strokeWidth={1.5} />
              )}
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-[1.125rem] font-bold text-white">{option.label}</span>
                  {option.hint && <span className="block text-[0.9375rem] text-white/60">{option.hint}</span>}
                </span>
                <KeyBadge n={i + 1} selected={selected} />
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "choice") {
    return (
      <div role="group" aria-labelledby="enquiry-question" className="grid gap-3">
        {step.options.map((option, i) => {
          const selected = answers[step.id] === option.value;
          const Icon = option.icon;
          return (
            <motion.button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChoose(step, option.value)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: easeOutExpo }}
              className={cn(
                "group flex min-h-16 w-full items-center gap-4 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-[border-color,background-color] duration-300",
                selected ? "border-gold bg-gold text-navy" : "border-white/15 bg-white/[0.04] hover:border-gold/60 hover:bg-white/[0.07]",
              )}
            >
              {Icon ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-xl transition-colors",
                    selected ? "bg-navy text-gold" : "bg-gold/12 text-gold ring-1 ring-gold/30",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.6} />
                </span>
              ) : (
                <KeyBadge n={i + 1} selected={selected} />
              )}
              <span className="flex-1">
                <span className={cn("block text-[1.125rem] font-bold", selected ? "text-navy" : "text-white")}>{option.label}</span>
                {option.hint && <span className={cn("block text-[0.9375rem]", selected ? "text-navy/75" : "text-white/60")}>{option.hint}</span>}
              </span>
              {Icon && <KeyBadge n={i + 1} selected={selected} />}
              {selected && <Check aria-hidden="true" className="size-6 shrink-0 text-navy" strokeWidth={2.5} />}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "multi") {
    const chosen = Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : [];
    return (
      <div role="group" aria-labelledby="enquiry-question" className="flex flex-wrap gap-3">
        {step.options.map((option) => {
          const selected = chosen.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(step, option.value)}
              className={cn(
                "inline-flex min-h-13 items-center gap-2 rounded-full border-[1.5px] px-5 text-[1.0625rem] font-bold transition-[border-color,background-color,color] duration-300",
                selected ? "border-gold bg-gold text-navy" : "border-white/20 text-white hover:border-gold/60",
              )}
            >
              {selected && <Check aria-hidden="true" className="size-4.5" strokeWidth={3} />}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "text") {
    const value = asText(answers[step.id]);
    return (
      <div>
        <label htmlFor={`enquiry-${step.id}`} className="sr-only">
          {step.title}
        </label>
        <input
          id={`enquiry-${step.id}`}
          type="text"
          value={value}
          onChange={(event) => onText(step, event.target.value)}
          placeholder={step.placeholder}
          autoComplete={step.id === "organisation" ? "organization" : "off"}
          className="w-full border-b-2 border-white/25 bg-transparent py-3 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] text-white transition-colors placeholder:text-white/30 focus:border-gold focus:outline-none focus-visible:outline-none"
        />
        {step.suggestions && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {step.suggestions.map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => onText(step, place)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-[0.9375rem] font-semibold transition-colors",
                  value === place ? "border-gold bg-gold text-navy" : "border-white/20 text-white/85 hover:border-gold/60",
                )}
              >
                {place}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Contact details
  return (
    <div className="grid gap-5">
      <input ref={honeypot} type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 font-bold text-white">
          Your name
          <input
            type="text"
            autoComplete="name"
            value={contact.name}
            onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
            className={cn(fieldClass, "font-normal")}
          />
        </label>
        <label className="grid gap-2 font-bold text-white">
          Phone or WhatsApp
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={contact.phone}
            onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))}
            className={cn(fieldClass, "font-normal")}
          />
        </label>
      </div>
      <label className="grid gap-2 font-bold text-white">
        <span>
          Email <span className="font-medium text-white/55">(optional)</span>
        </span>
        <input
          type="email"
          autoComplete="email"
          value={contact.email}
          onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
          className={cn(fieldClass, "font-normal")}
        />
      </label>
      <label className="grid gap-2 font-bold text-white">
        <span>
          Anything else we should know? <span className="font-medium text-white/55">(optional)</span>
        </span>
        <textarea
          rows={3}
          value={contact.message}
          onChange={(event) => setContact((current) => ({ ...current, message: event.target.value }))}
          className={cn(fieldClass, "min-h-24 resize-y font-normal leading-normal")}
        />
      </label>
      <label className="flex cursor-pointer items-start gap-3.5 text-[0.9375rem] leading-normal text-white/80">
        <input
          type="checkbox"
          checked={contact.consent}
          onChange={(event) => setContact((current) => ({ ...current, consent: event.target.checked }))}
          className="mt-0.5 size-5.5 shrink-0 cursor-pointer accent-gold"
        />
        <span>{site.name} may call or WhatsApp me about this request. My details won’t be shared with anyone else.</span>
      </label>
    </div>
  );
}

function KeyBadge({ n, selected }: { n: number; selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "hidden size-8 shrink-0 place-items-center rounded-lg border text-sm font-bold sm:grid",
        selected ? "border-navy/30 text-navy" : "border-white/20 text-white/60",
      )}
    >
      {n}
    </span>
  );
}

/** Thank-you screen: gold sparkles burst from the arch. */
function Success({
  name,
  phone,
  headingRef,
  onRestart,
}: {
  name: string;
  phone: string;
  headingRef: (node: HTMLHeadingElement | null) => void;
  onRestart: () => void;
}) {
  const reduce = useReducedMotion();
  const firstName = name.trim().split(" ")[0];
  return (
    <div className="relative">
      {!reduce && (
        <div aria-hidden="true" className="pointer-events-none absolute top-10 left-10">
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute size-2.5 rounded-full bg-gold"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(angle) * 140, y: Math.sin(angle) * 110, opacity: 0, scale: 0.3 }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.3 }}
              />
            );
          })}
        </div>
      )}
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-normal text-white focus:outline-none"
      >
        Thank you{firstName ? `, ${firstName}` : ""}.<br />
        <span className="text-gold italic">Your request is in.</span>
      </h3>
      <p className="mt-5 max-w-lg text-lead text-white/75">
        We’ll call or WhatsApp you soon{phone.trim() ? ` on ${phone.trim()}` : ""} to talk it through. There’s nothing to pay
        and nothing else you need to do.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-9 inline-flex min-h-[3.5rem] items-center gap-2 rounded-full border-[1.5px] border-white/25 px-6 font-bold text-white transition-colors hover:border-white"
      >
        Start another request
        <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2} />
      </button>
    </div>
  );
}
