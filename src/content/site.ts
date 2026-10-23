/**
 * Global site settings: name, status and navigation.
 */

export const site = {
  // Working name. The final name will be one of Shloka Care, Shloka Sahayak or Shloka Arogya;
  // changing it here updates the logo, metadata and copy everywhere.
  name: "Shloka Care",
  descriptor: "Verified care companions in Lucknow",
  description:
    "Verified, trained companions for hospital visits, elderly care and errands in Lucknow, for families who can’t always be there. Starting soon.",
  // Set once the domain is live (e.g. "https://example.in") to add canonical URLs.
  url: "",
  status: "Starting soon in Lucknow",
  emergency: "In a medical emergency, always call 108 for an ambulance, or 112, first.",
};

export const navigation = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Safety", href: "#safety" },
  { label: "FAQ", href: "#faq" },
];
