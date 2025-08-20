// constants/validation.ts
// Validation-related constants

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  SPECIAL_CHARS: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

// Email validation
export const EMAIL_VALIDATION = {
  MAX_LENGTH: 254,
  REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;

// Phone validation
export const PHONE_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 15,
  REGEX: /^\+?[\d\s\-\(\)]+$/,
} as const;

// Name validation
export const NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  REGEX: /^[a-zA-Z\s'-]+$/,
} as const;

// Company validation
export const COMPANY_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
  REGEX: /^[a-zA-Z0-9\s&.,'-]+$/,
} as const;

// Deal value validation
export const DEAL_VALUE_VALIDATION = {
  MIN_VALUE: 0.01,
  MAX_VALUE: 999999999.99,
  DECIMAL_PLACES: 2,
} as const;

// Text field validation
export const TEXT_FIELD_VALIDATION = {
  SHORT_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  MEDIUM_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
  LONG_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
  },
} as const;

// File upload validation
export const FILE_UPLOAD_VALIDATION = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  MAX_FILES: 10,
} as const;

// URL validation
export const URL_VALIDATION = {
  REGEX:
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  MAX_LENGTH: 2048,
} as const;

// Date validation
export const DATE_VALIDATION = {
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
  FORMATS: {
    ISO: "YYYY-MM-DD",
    US: "MM/DD/YYYY",
    EU: "DD/MM/YYYY",
    DATETIME: "YYYY-MM-DD HH:mm:ss",
  },
} as const;

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must be no more than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`,
  PASSWORD_MISSING_UPPERCASE:
    "Password must contain at least one uppercase letter",
  PASSWORD_MISSING_LOWERCASE:
    "Password must contain at least one lowercase letter",
  PASSWORD_MISSING_NUMBER: "Password must contain at least one number",
  PASSWORD_MISSING_SPECIAL:
    "Password must contain at least one special character",
  PHONE_INVALID: "Please enter a valid phone number",
  NAME_TOO_SHORT: `Name must be at least ${NAME_VALIDATION.MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must be no more than ${NAME_VALIDATION.MAX_LENGTH} characters`,
  NAME_INVALID_CHARS:
    "Name can only contain letters, spaces, hyphens, and apostrophes",
  COMPANY_TOO_SHORT: `Company name must be at least ${COMPANY_VALIDATION.MIN_LENGTH} characters`,
  COMPANY_TOO_LONG: `Company name must be no more than ${COMPANY_VALIDATION.MAX_LENGTH} characters`,
  DEAL_VALUE_TOO_LOW: `Deal value must be at least $${DEAL_VALUE_VALIDATION.MIN_VALUE}`,
  DEAL_VALUE_TOO_HIGH: `Deal value cannot exceed $${DEAL_VALUE_VALIDATION.MAX_VALUE}`,
  FILE_TOO_LARGE: `File size cannot exceed ${
    FILE_UPLOAD_VALIDATION.MAX_FILE_SIZE / 1024 / 1024
  }MB`,
  FILE_TYPE_NOT_ALLOWED: "File type not allowed",
  URL_INVALID: "Please enter a valid URL",
  DATE_INVALID: "Please enter a valid date",
} as const;
