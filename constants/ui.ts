// constants/ui.ts
// UI-related constants

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Z-index values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Component sizes
export const COMPONENT_SIZES = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

// Button variants
export const BUTTON_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  OUTLINE: "outline",
  SECONDARY: "secondary",
  GHOST: "ghost",
  LINK: "link",
} as const;

// Input variants
export const INPUT_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  OUTLINE: "outline",
} as const;

// Badge variants
export const BADGE_VARIANTS = {
  DEFAULT: "default",
  SECONDARY: "secondary",
  DESTRUCTIVE: "destructive",
  OUTLINE: "outline",
} as const;

// Alert variants
export const ALERT_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
} as const;

// Toast variants
export const TOAST_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Common spacing values
export const SPACING = {
  XS: "0.25rem", // 4px
  SM: "0.5rem", // 8px
  MD: "1rem", // 16px
  LG: "1.5rem", // 24px
  XL: "2rem", // 32px
  "2XL": "3rem", // 48px
  "3XL": "4rem", // 64px
} as const;

// Border radius values
export const BORDER_RADIUS = {
  NONE: "0",
  SM: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  MD: "0.375rem", // 6px
  LG: "0.5rem", // 8px
  XL: "0.75rem", // 12px
  "2XL": "1rem", // 16px
  FULL: "9999px",
} as const;

// Font weights
export const FONT_WEIGHTS = {
  THIN: 100,
  EXTRALIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRABOLD: 800,
  BLACK: 900,
} as const;

// Font sizes
export const FONT_SIZES = {
  XS: "0.75rem", // 12px
  SM: "0.875rem", // 14px
  BASE: "1rem", // 16px
  LG: "1.125rem", // 18px
  XL: "1.25rem", // 20px
  "2XL": "1.5rem", // 24px
  "3XL": "1.875rem", // 30px
  "4XL": "2.25rem", // 36px
} as const;

// Table settings
export const TABLE_SETTINGS = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_ROWS_PER_PAGE: 100,
} as const;

// Form settings
export const FORM_SETTINGS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;
