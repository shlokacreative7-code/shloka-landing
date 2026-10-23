import { Check, Lock, MapPin, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Example app screens, one per safety point (same order as trustPoints in content/home.ts).
 * Illustrative only: no real people, prices or documents.
 */

function Screen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-2 pb-6 text-[0.875rem] leading-snug text-copy">
      <p className="text-xs font-bold tracking-[0.14em] text-muted uppercase">{title}</p>
      {children}
    </div>
  );
}

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
    <span className="text-muted">{label}</span>
    <span className={cn("text-right font-semibold text-ink", strong && "text-base")}>{value}</span>
  </div>
);

const Avatar = ({ className }: { className?: string }) => (
  <span className={cn("grid size-16 place-items-center rounded-full border-2 border-gold bg-canvas-soft text-ink", className)}>
    <UserRound aria-hidden="true" className="size-8" strokeWidth={1.5} />
  </span>
);

const Tick = () => (
  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-navy">
    <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
  </span>
);

export const phoneScreens: ReactNode[] = [
  <Screen key="verified" title="Your companion">
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-line">
      <Avatar />
      <div>
        <p className="font-bold text-ink">Assigned for Tuesday</p>
        <p className="text-muted">9 am · Hospital Assist</p>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-gold dark:bg-gold dark:text-navy">
          <ShieldCheck aria-hidden="true" className="size-3.5" /> Verified
        </span>
      </div>
    </div>
    <ul className="grid gap-3 rounded-2xl bg-card p-4 ring-1 ring-line">
      {["Identity checked", "Police verification", "References", "Training complete"].map((item) => (
        <li key={item} className="flex items-center gap-3 font-semibold text-ink">
          <Tick />
          {item}
        </li>
      ))}
    </ul>
  </Screen>,

  <Screen key="codes" title="Start code">
    <p className="font-serif text-[1.75rem] leading-tight text-ink">Share this when your companion arrives</p>
    <div className="grid grid-cols-4 gap-2">
      {["4", "8", "2", "1"].map((digit, i) => (
        <span key={i} className="grid aspect-[3/4] place-items-center rounded-xl bg-card font-serif text-4xl text-ink ring-2 ring-gold">
          {digit}
        </span>
      ))}
    </div>
    <p>Your visit only begins once the code is entered. A second code ends it, and both times are saved.</p>
    <div className="mt-auto rounded-2xl bg-card p-4 ring-1 ring-line">
      <Row label="Started" value="9:02 am" />
      <Row label="End code" value="At the end" />
    </div>
  </Screen>,

  <Screen key="coming" title="On the way">
    <div className="relative h-36 overflow-hidden rounded-2xl bg-canvas-soft ring-1 ring-line">
      <svg viewBox="0 0 240 140" fill="none" aria-hidden="true" className="absolute inset-0 size-full">
        <path d="M20 120C60 120 60 70 110 70S170 30 220 26" className="stroke-gold" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx="20" cy="120" r="6" className="fill-ink" />
      </svg>
      <MapPin aria-hidden="true" className="absolute top-2 right-3 size-8 fill-gold text-navy" strokeWidth={1.5} />
    </div>
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-line">
      <Avatar className="size-14" />
      <div>
        <p className="font-bold text-ink">Arriving in 12 min</p>
        <p className="text-muted">Speaks Hindi and English</p>
      </div>
    </div>
    <p>You see their photo, languages and checks before they reach the door.</p>
  </Screen>,

  <Screen key="sos" title="Live visit">
    <div className="relative mx-auto mt-6 grid size-40 place-items-center">
      <span className="absolute inset-0 rounded-full bg-gold/30 motion-safe:animate-ping-ring" />
      <span className="absolute inset-4 rounded-full bg-gold/30 motion-safe:animate-ping-ring [animation-delay:0.8s]" />
      <span className="relative grid size-28 place-items-center rounded-full bg-gold font-sans text-3xl font-extrabold tracking-wide text-navy shadow-glow">
        SOS
      </span>
    </div>
    <p className="text-center font-semibold text-ink">One tap alerts our team and your trusted contact.</p>
    <div className="mt-auto rounded-2xl bg-card p-4 ring-1 ring-line">
      <Row label="Our team" value="Alerted" />
      <Row label="Trusted contact" value="Alerted" />
    </div>
  </Screen>,

  <Screen key="pricing" title="Before you confirm">
    <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
      <Row label="Service" value="Hospital Assist" />
      <Row label="Hours" value="8" />
      <Row label="GST" value="Included" />
      <Row label="Total" value="Shown before you book" strong />
    </div>
    <p>No surprises: you see the full amount first, and pay only after the visit.</p>
    <div className="mt-auto grid gap-2">
      <span className="rounded-full bg-navy py-3 text-center font-bold text-white dark:bg-gold dark:text-navy">Pay after the visit</span>
      <span className="text-center text-xs text-muted">UPI or card · GST invoice on WhatsApp</span>
    </div>
  </Screen>,

  <Screen key="privacy" title="Your privacy">
    <span className="mx-auto mt-2 grid size-20 place-items-center rounded-full bg-navy text-gold dark:bg-gold dark:text-navy">
      <Lock aria-hidden="true" className="size-9" strokeWidth={1.5} />
    </span>
    <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
      <Row label="Documents" value="Encrypted" />
      <Row label="Aadhaar" value="•••• 1234" />
      <Row label="Shared with others" value="Never" />
    </div>
    <p>Only the last four digits of an Aadhaar number are ever kept.</p>
    <span className="mt-auto text-center font-bold text-ink underline decoration-gold decoration-2 underline-offset-4">Delete my data</span>
  </Screen>,
];
