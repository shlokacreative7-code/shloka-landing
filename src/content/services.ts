export type Service = {
  title: string;
  summary: string;
  /** Illustration in public/illustrations/, drawn in the brand style. */
  illustration: string;
  includes: string[];
};

/** Phase 1 services, available from launch. */
export const services: Service[] = [
  {
    title: "Hospital Assist",
    summary: "A steady companion for hospital days, from the first queue to the drive home.",
    illustration: "/illustrations/hospital-assist.svg",
    includes: [
      "Registration, queues and OPD visits",
      "Collecting reports and medicines",
      "Staying by the bedside",
      "Updates to you through the day",
    ],
  },
  {
    title: "Elderly Care",
    summary: "Company and a helping hand for parents and grandparents at home.",
    illustration: "/illustrations/elderly-care.svg",
    includes: [
      "Conversation and a short walk",
      "Going along to doctor’s appointments",
      "Trips to the market or temple",
      "A note to you after every visit",
    ],
  },
  {
    title: "Personal Assist",
    summary: "The errands that need someone there in person, done properly.",
    illustration: "/illustrations/personal-assist.svg",
    includes: [
      "Bank and post office visits",
      "Bills, forms and paperwork",
      "Standing in queues for you",
      "Collecting and dropping off",
    ],
  },
];

/** Phase 2 and 3 services, mentioned but not offered yet. */
export const comingLater = "24×7 urgent help, a driver for your own car, and monthly care plans.";
