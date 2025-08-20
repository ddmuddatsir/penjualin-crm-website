// constants/activity.ts
// Activity-related constants

// Activity types
export const ACTIVITY_TYPE = {
  MEETING: "MEETING",
  CALL: "CALL",
  DEMO: "DEMO",
  EMAIL: "EMAIL",
  TASK: "TASK",
  NOTE: "NOTE",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

// Activity type options array
export const ACTIVITY_TYPE_OPTIONS = Object.values(ACTIVITY_TYPE);

// Activity type labels for UI display
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ACTIVITY_TYPE.MEETING]: "Meeting",
  [ACTIVITY_TYPE.CALL]: "Call",
  [ACTIVITY_TYPE.DEMO]: "Demo",
  [ACTIVITY_TYPE.EMAIL]: "Email",
  [ACTIVITY_TYPE.TASK]: "Task",
  [ACTIVITY_TYPE.NOTE]: "Note",
};

// Activity type icons
export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  [ACTIVITY_TYPE.MEETING]: "📅",
  [ACTIVITY_TYPE.CALL]: "📞",
  [ACTIVITY_TYPE.DEMO]: "💻",
  [ACTIVITY_TYPE.EMAIL]: "✉️",
  [ACTIVITY_TYPE.TASK]: "📋",
  [ACTIVITY_TYPE.NOTE]: "📝",
};

// Activity statuses
export const ACTIVITY_STATUS = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

export type ActivityStatus =
  (typeof ACTIVITY_STATUS)[keyof typeof ACTIVITY_STATUS];

// Activity status options array
export const ACTIVITY_STATUS_OPTIONS = Object.values(ACTIVITY_STATUS);

// Activity status labels for UI display
export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  [ACTIVITY_STATUS.SCHEDULED]: "Scheduled",
  [ACTIVITY_STATUS.IN_PROGRESS]: "In Progress",
  [ACTIVITY_STATUS.COMPLETED]: "Completed",
  [ACTIVITY_STATUS.CANCELLED]: "Cancelled",
  [ACTIVITY_STATUS.NO_SHOW]: "No Show",
};

// Activity priorities
export const ACTIVITY_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type ActivityPriority =
  (typeof ACTIVITY_PRIORITY)[keyof typeof ACTIVITY_PRIORITY];

// Activity priority options array
export const ACTIVITY_PRIORITY_OPTIONS = Object.values(ACTIVITY_PRIORITY);

// Activity priority labels for UI display
export const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  [ACTIVITY_PRIORITY.LOW]: "Low",
  [ACTIVITY_PRIORITY.MEDIUM]: "Medium",
  [ACTIVITY_PRIORITY.HIGH]: "High",
  [ACTIVITY_PRIORITY.URGENT]: "Urgent",
};
