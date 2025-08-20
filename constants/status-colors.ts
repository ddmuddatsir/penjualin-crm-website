/**
 * Status color mappings for consistent styling across the application
 * Used with StatusBadge component
 */

export const STATUS_COLOR_MAPS = {
  lead: {
    NEW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CONTACTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    QUALIFIED:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    CONVERTED:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  deal: {
    OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    WON: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ON_HOLD:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  activity: {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    COMPLETED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    IN_PROGRESS:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  user: {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  general: {
    SUCCESS:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    WARNING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    NEUTRAL: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
} as const;

/**
 * Status options for dropdowns and forms
 */
export const STATUS_OPTIONS = {
  lead: [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "LOST", label: "Lost" },
  ],
  deal: [
    { value: "OPEN", label: "Open" },
    { value: "WON", label: "Won" },
    { value: "LOST", label: "Lost" },
    { value: "ON_HOLD", label: "On Hold" },
  ],
  activity: [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ],
  user: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "PENDING", label: "Pending" },
    { value: "SUSPENDED", label: "Suspended" },
  ],
} as const;

/**
 * Priority levels for activities and tasks
 */
export const PRIORITY_LEVELS = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  MEDIUM:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

/**
 * Type definitions for better TypeScript support
 */
export type LeadStatus = keyof typeof STATUS_COLOR_MAPS.lead;
export type DealStatus = keyof typeof STATUS_COLOR_MAPS.deal;
export type ActivityStatus = keyof typeof STATUS_COLOR_MAPS.activity;
export type UserStatus = keyof typeof STATUS_COLOR_MAPS.user;
export type GeneralStatus = keyof typeof STATUS_COLOR_MAPS.general;
export type PriorityLevel = keyof typeof PRIORITY_LEVELS;
