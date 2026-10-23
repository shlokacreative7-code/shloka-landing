import { Hash, Heart, IdCard, Lock, MapPin, ReceiptIndianRupee, Route, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";

type Point = { title: string; body: string; icon: LucideIcon };

export const heroPoints = [
  "Police-verified, trained companions",
  "A code to start and end every visit",
  "Pay after the visit, with a GST invoice",
];

export const audiences: Point[] = [
  {
    title: "Working in another city or abroad",
    body: "Your parents are in Lucknow and you’re in Bengaluru, Delhi or overseas. We can go to the appointment you can’t make and tell you how it went.",
    icon: MapPin,
  },
  {
    title: "Coming to Lucknow for treatment",
    body: "Travelling in from another district with no family in the city? A companion can handle the queues, reports and pharmacy runs while you focus on the patient.",
    icon: Route,
  },
  {
    title: "Elders living on their own",
    body: "Regular visits bring company, a steady hand for getting out and about, and peace of mind for everyone in the family.",
    icon: Heart,
  },
];

export const steps = [
  {
    title: "Tell us what you need",
    body: "Pick the service, the date, how many hours and the address or hospital. You see the price before you confirm.",
  },
  {
    title: "Meet your companion",
    body: "Once a companion is assigned, you get their name, photo, languages and verification checks.",
  },
  {
    title: "Start with your code",
    body: "The visit begins only when you share a one-time start code, and ends with an end code. Times are recorded automatically.",
  },
  {
    title: "Stay updated, then pay",
    body: "Follow the visit as it happens. Pay by UPI or card once it’s done and get a GST invoice on WhatsApp or email.",
  },
];

export const trustPoints: Point[] = [
  {
    title: "Verified before the first visit",
    body: "Identity checks, police verification and references, then training, before anyone joins.",
    icon: ShieldCheck,
  },
  {
    title: "A code to start, a code to finish",
    body: "Your one-time codes open and close every visit, so arrival and finish times are on record.",
    icon: Hash,
  },
  {
    title: "You see who is coming",
    body: "Name, photo, languages and checks are shared with you as soon as a companion is assigned.",
    icon: IdCard,
  },
  {
    title: "SOS on every live visit",
    body: "One tap alerts our team and a trusted contact you choose.",
    icon: TriangleAlert,
  },
  {
    title: "Clear, upfront pricing",
    body: "The full price, including GST, before you confirm. Pay after the visit and get a proper invoice.",
    icon: ReceiptIndianRupee,
  },
  {
    title: "Your details stay private",
    body: "We ask before we collect. Documents are encrypted, Aadhaar numbers are never stored in full, and we don’t sell or share your data.",
    icon: Lock,
  },
];

/** Scrolling trust ticker under the hero. */
export const marqueeItems = [
  "Police-verified companions",
  "ID and reference checks",
  "Trained for hospital and elder care",
  "One-time start and end codes",
  "SOS on every live visit",
  "Updates on WhatsApp",
  "Pay after the visit",
  "A GST invoice every time",
];

export const enquiryPoints = [
  "No payment or commitment",
  "A real person gets back to you",
  "Your details are only used to reply",
];
