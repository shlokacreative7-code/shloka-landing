import { Building2, HeartHandshake, UserRound, type LucideIcon } from "lucide-react";
import { services } from "./services";

/*
 * The enquiry flow: one question per screen. The first question picks a path (family, companion or
 * partner). Every answer is sent to Web3Forms under its question `id`, and shown on the live ticket
 * under `ticketLabel`.
 */

export type Flow = "family" | "companion" | "partner";

export type Option = {
  value: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
  /** Illustration for picture tiles. */
  image?: string;
};

type Base = { id: string; title: string; subtitle?: string; ticketLabel: string };

export type Question =
  | (Base & { kind: "choice"; options: Option[]; layout?: "list" | "tiles" })
  | (Base & { kind: "multi"; options: Option[] })
  | (Base & { kind: "text"; placeholder: string; suggestions?: string[]; required?: boolean })
  | (Base & { kind: "contact" });

const plain = (values: string[]): Option[] => values.map((value) => ({ value, label: value }));

const lucknowPlaces = ["SGPGI", "KGMU", "Lohia", "Medanta", "Gomti Nagar", "Indira Nagar", "Aliganj", "Hazratganj"];

export const intentQuestion: Question = {
  id: "enquiring_as",
  kind: "choice",
  title: "What brings you here?",
  subtitle: "Pick one to begin. It takes about a minute.",
  ticketLabel: "Request",
  options: [
    { value: "family", label: "I need care for someone", hint: "For a parent, grandparent or yourself", icon: HeartHandshake },
    { value: "companion", label: "I want to work as a companion", hint: "Join our verified team", icon: UserRound },
    { value: "partner", label: "We’re a hospital, clinic or society", hint: "Work with us", icon: Building2 },
  ],
};

/** How each path appears in the email and on the ticket. */
export const flowLabels: Record<Flow, string> = {
  family: "Family needing care",
  companion: "Wants to work as a companion",
  partner: "Hospital or partner",
};

const contactQuestion: Question = {
  id: "contact",
  kind: "contact",
  title: "How can we reach you?",
  subtitle: "We’ll call or WhatsApp you to talk it through. No payment, no commitment.",
  ticketLabel: "Contact",
};

export const flows: Record<Flow, Question[]> = {
  family: [
    {
      id: "for_whom",
      kind: "choice",
      title: "Who needs care?",
      ticketLabel: "For",
      options: [
        { value: "A parent", label: "My mother or father" },
        { value: "A grandparent", label: "A grandparent" },
        { value: "A spouse", label: "My husband or wife" },
        { value: "Myself", label: "Myself" },
        { value: "Someone else", label: "Someone else" },
      ],
    },
    {
      id: "service",
      kind: "choice",
      layout: "tiles",
      title: "What kind of help?",
      ticketLabel: "Service",
      options: [
        ...services.map((service) => ({ value: service.title, label: service.title, image: service.illustration })),
        { value: "Not sure yet", label: "Not sure yet", hint: "We’ll help you decide" },
      ],
    },
    {
      id: "when",
      kind: "choice",
      title: "When do you need someone?",
      ticketLabel: "When",
      options: plain(["As soon as possible", "Within a week", "This month", "Just exploring for now"]),
    },
    {
      id: "area",
      kind: "text",
      title: "Where in Lucknow?",
      subtitle: "A hospital or neighbourhood is enough. You can skip this.",
      ticketLabel: "Where",
      placeholder: "e.g. SGPGI, or Gomti Nagar",
      suggestions: lucknowPlaces,
    },
    contactQuestion,
  ],
  companion: [
    {
      id: "languages",
      kind: "multi",
      title: "Which languages do you speak?",
      subtitle: "Choose all that apply.",
      ticketLabel: "Languages",
      options: plain(["Hindi", "English", "Urdu", "Awadhi", "Bhojpuri", "Other"]),
    },
    {
      id: "experience",
      kind: "choice",
      title: "Any caregiving experience?",
      ticketLabel: "Experience",
      options: plain(["Not yet, but keen to learn", "Less than a year", "1 to 3 years", "More than 3 years"]),
    },
    {
      id: "area",
      kind: "text",
      title: "Where do you live?",
      subtitle: "Your area of Lucknow helps us match you with nearby visits. You can skip this.",
      ticketLabel: "Area",
      placeholder: "e.g. Aliganj",
      suggestions: lucknowPlaces.slice(4),
    },
    contactQuestion,
  ],
  partner: [
    {
      id: "organisation_type",
      kind: "choice",
      title: "What kind of organisation?",
      ticketLabel: "Type",
      options: plain(["Hospital", "Clinic or nursing home", "Housing society or RWA", "Company", "Something else"]),
    },
    {
      id: "organisation",
      kind: "text",
      title: "What’s it called?",
      ticketLabel: "Organisation",
      placeholder: "Organisation name",
      required: true,
    },
    contactQuestion,
  ],
};
