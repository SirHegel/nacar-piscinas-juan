export const moduleKeys = [
  "experience",
  "system",
  "approach",
  "process",
  "about",
  "fit",
  "diagnostic",
  "faq",
  "finalCta",
] as const;

export type ModuleKey = (typeof moduleKeys)[number];

export const leadStatuses = ["new", "contacted", "qualified", "won", "archived"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
