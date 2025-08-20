// constants/deal.ts
// Deal-related constants

// Deal statuses
export const DEAL_STATUS = {
  OPEN: "OPEN",
  NEGOTIATION: "NEGOTIATION",
  PROPOSAL_SENT: "PROPOSAL_SENT",
  ON_HOLD: "ON_HOLD",
  WON: "WON",
  LOST: "LOST",
} as const;

export type DealStatus = (typeof DEAL_STATUS)[keyof typeof DEAL_STATUS];

// Deal status options array
export const DEAL_STATUS_OPTIONS = Object.values(DEAL_STATUS);

// Deal status labels for UI display
export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  [DEAL_STATUS.OPEN]: "Open",
  [DEAL_STATUS.NEGOTIATION]: "Negotiation",
  [DEAL_STATUS.PROPOSAL_SENT]: "Proposal Sent",
  [DEAL_STATUS.ON_HOLD]: "On Hold",
  [DEAL_STATUS.WON]: "Won",
  [DEAL_STATUS.LOST]: "Lost",
};

// Deal stages (sales pipeline stages)
export const DEAL_STAGE = {
  QUALIFICATION: "QUALIFICATION",
  NEEDS_ANALYSIS: "NEEDS_ANALYSIS",
  PROPOSAL: "PROPOSAL",
  NEGOTIATION: "NEGOTIATION",
  CLOSED_WON: "CLOSED_WON",
  CLOSED_LOST: "CLOSED_LOST",
} as const;

export type DealStage = (typeof DEAL_STAGE)[keyof typeof DEAL_STAGE];

// Deal stage options array
export const DEAL_STAGE_OPTIONS = Object.values(DEAL_STAGE);

// Deal stage labels for UI display
export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  [DEAL_STAGE.QUALIFICATION]: "Qualification",
  [DEAL_STAGE.NEEDS_ANALYSIS]: "Needs Analysis",
  [DEAL_STAGE.PROPOSAL]: "Proposal",
  [DEAL_STAGE.NEGOTIATION]: "Negotiation",
  [DEAL_STAGE.CLOSED_WON]: "Closed Won",
  [DEAL_STAGE.CLOSED_LOST]: "Closed Lost",
};

// Deal probabilities (for forecasting)
export const DEAL_STAGE_PROBABILITY: Record<DealStage, number> = {
  [DEAL_STAGE.QUALIFICATION]: 0.1,
  [DEAL_STAGE.NEEDS_ANALYSIS]: 0.25,
  [DEAL_STAGE.PROPOSAL]: 0.5,
  [DEAL_STAGE.NEGOTIATION]: 0.75,
  [DEAL_STAGE.CLOSED_WON]: 1.0,
  [DEAL_STAGE.CLOSED_LOST]: 0.0,
};

// Deal sources
export const DEAL_SOURCE = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
  REFERRAL: "REFERRAL",
  PARTNER: "PARTNER",
  TRADE_SHOW: "TRADE_SHOW",
  WEBSITE: "WEBSITE",
} as const;

export type DealSource = (typeof DEAL_SOURCE)[keyof typeof DEAL_SOURCE];

// Deal source options array
export const DEAL_SOURCE_OPTIONS = Object.values(DEAL_SOURCE);

// Deal source labels for UI display
export const DEAL_SOURCE_LABELS: Record<DealSource, string> = {
  [DEAL_SOURCE.INBOUND]: "Inbound",
  [DEAL_SOURCE.OUTBOUND]: "Outbound",
  [DEAL_SOURCE.REFERRAL]: "Referral",
  [DEAL_SOURCE.PARTNER]: "Partner",
  [DEAL_SOURCE.TRADE_SHOW]: "Trade Show",
  [DEAL_SOURCE.WEBSITE]: "Website",
};
