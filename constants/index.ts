// constants/index.ts
// Main constants export file

// Re-export all constants for easy importing
export * from "./activity";
export * from "./api";
export * from "./deal";
export * from "./lead";
export * from "./ui";
export * from "./user";
export * from "./validation";

// App-wide constants
export const APP_CONFIG = {
  NAME: "CRM SaaS",
  DESCRIPTION: "Customer Relationship Management System",
  VERSION: "1.0.0",
  AUTHOR: "Your Company",
  EMAIL: "support@yourcompany.com",
  URL: "https://yourcrm.com",
} as const;

// Environment constants
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  TEST: "test",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "crm_user_preferences",
  THEME: "crm_theme",
  SIDEBAR_COLLAPSED: "crm_sidebar_collapsed",
  TABLE_SETTINGS: "crm_table_settings",
  FILTERS: "crm_filters",
  RECENT_SEARCHES: "crm_recent_searches",
} as const;

// Session storage keys
export const SESSION_KEYS = {
  FORM_DATA: "crm_form_data",
  NAVIGATION_STATE: "crm_navigation_state",
  TEMP_DATA: "crm_temp_data",
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  INPUT: "yyyy-MM-dd",
  FULL: "EEEE, MMMM dd, yyyy",
  SHORT: "MM/dd/yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// Currency formats
export const CURRENCY_FORMATS = {
  USD: {
    CODE: "USD",
    SYMBOL: "$",
    DECIMAL_PLACES: 2,
    LOCALE: "en-US",
  },
  EUR: {
    CODE: "EUR",
    SYMBOL: "€",
    DECIMAL_PLACES: 2,
    LOCALE: "en-EU",
  },
  GBP: {
    CODE: "GBP",
    SYMBOL: "£",
    DECIMAL_PLACES: 2,
    LOCALE: "en-GB",
  },
} as const;

// Time zones
export const TIME_ZONES = {
  UTC: "UTC",
  EST: "America/New_York",
  PST: "America/Los_Angeles",
  GMT: "Europe/London",
  CET: "Europe/Paris",
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_ADVANCED_FILTERS: true,
  ENABLE_BULK_ACTIONS: true,
  ENABLE_EMAIL_INTEGRATION: false,
  ENABLE_CALENDAR_INTEGRATION: false,
} as const;

// Limits
export const LIMITS = {
  MAX_USERS: 1000,
  MAX_LEADS_PER_USER: 10000,
  MAX_DEALS_PER_USER: 1000,
  MAX_ACTIVITIES_PER_USER: 5000,
  MAX_FILE_UPLOADS_PER_DAY: 100,
  MAX_API_REQUESTS_PER_HOUR: 1000,
} as const;
