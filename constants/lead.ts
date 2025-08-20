// constants/lead.ts
// Lead-related constants

// Lead statuses
export const LEAD_STATUS = {
  OPEN: "OPEN",
  CONTACTED: "CONTACTED",
  PROPOSAL: "PROPOSAL",
  CLOSED: "CLOSED",
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

// Lead status options array
export const LEAD_STATUS_OPTIONS = Object.values(LEAD_STATUS);

// Lead status labels for UI display
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LEAD_STATUS.OPEN]: "Open",
  [LEAD_STATUS.CONTACTED]: "Contacted",
  [LEAD_STATUS.PROPOSAL]: "Proposal",
  [LEAD_STATUS.CLOSED]: "Closed",
};

// Lead sources
export const LEAD_SOURCE = {
  WEBSITE: "WEBSITE",
  REFERRAL: "REFERRAL",
  COLD_CALL: "COLD_CALL",
  SOCIAL_MEDIA: "SOCIAL_MEDIA",
  EMAIL_CAMPAIGN: "EMAIL_CAMPAIGN",
  TRADE_SHOW: "TRADE_SHOW",
} as const;

export type LeadSource = (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE];

// Lead source options array
export const LEAD_SOURCE_OPTIONS = Object.values(LEAD_SOURCE);

// Lead source labels for UI display
export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  [LEAD_SOURCE.WEBSITE]: "Website",
  [LEAD_SOURCE.REFERRAL]: "Referral",
  [LEAD_SOURCE.COLD_CALL]: "Cold Call",
  [LEAD_SOURCE.SOCIAL_MEDIA]: "Social Media",
  [LEAD_SOURCE.EMAIL_CAMPAIGN]: "Email Campaign",
  [LEAD_SOURCE.TRADE_SHOW]: "Trade Show",
};

// Lead priorities
export const LEAD_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type LeadPriority = (typeof LEAD_PRIORITY)[keyof typeof LEAD_PRIORITY];

// Lead priority options array
export const LEAD_PRIORITY_OPTIONS = Object.values(LEAD_PRIORITY);

// Lead priority labels for UI display
export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  [LEAD_PRIORITY.LOW]: "Low",
  [LEAD_PRIORITY.MEDIUM]: "Medium",
  [LEAD_PRIORITY.HIGH]: "High",
  [LEAD_PRIORITY.URGENT]: "Urgent",
};
