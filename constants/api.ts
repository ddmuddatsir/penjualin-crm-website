// constants/api.ts
// API-related constants

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/api/auth/signin",
    LOGOUT: "/api/auth/signout",
    REGISTER: "/api/auth/register",
    SESSION: "/api/auth/session",
  },

  // User endpoints
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: "/api/users/profile",
  },

  // Lead endpoints
  LEADS: {
    BASE: "/api/leads",
    BY_ID: (id: string) => `/api/leads/${id}`,
    SEARCH: "/api/leads/search",
    EXPORT: "/api/leads/export",
  },

  // Deal endpoints
  DEALS: {
    BASE: "/api/deals",
    BY_ID: (id: string) => `/api/deals/${id}`,
    PIPELINE: "/api/deals/pipeline",
    FORECAST: "/api/deals/forecast",
  },

  // Activity endpoints
  ACTIVITIES: {
    BASE: "/api/activities",
    BY_ID: (id: string) => `/api/activities/${id}`,
    CALENDAR: "/api/activities/calendar",
    SYNC: "/api/activities/sync",
  },

  // Report endpoints
  REPORTS: {
    BASE: "/api/reports",
    DASHBOARD: "/api/dashboard",
    ANALYTICS: "/api/reports/analytics",
    EXPORT: "/api/reports/export",
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// HTTP methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

// Request headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  USER_AGENT: "User-Agent",
} as const;

// Content types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
  HTML: "text/html",
} as const;

// API response messages
export const API_MESSAGES = {
  SUCCESS: {
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    FETCHED: "Data fetched successfully",
  },
  ERROR: {
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    VALIDATION_ERROR: "Validation error",
    INTERNAL_ERROR: "Internal server error",
    NETWORK_ERROR: "Network error occurred",
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;
