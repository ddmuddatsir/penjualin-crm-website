// lib/colors.ts

// Status colors (for pipeline, dashboard, etc)
// Digunakan untuk warna utama status lead di pipeline, dashboard, badge status
export const STATUS_COLORS: Record<string, string> = {
  OPEN: "#2563eb", // Biru: status Open
  CONTACTED: "#eab308", // Kuning: status Contacted
  PROPOSAL: "#a21caf", // Ungu: status Proposal
  CLOSED: "#22c55e", // Hijau: status Closed
};

// Status background/border untuk pipeline columns
// Digunakan untuk background dan border kolom pipeline
export const STATUS_BG_BORDER: Record<string, string> = {
  OPEN: "bg-blue-100 border-blue-400",
  CONTACTED: "bg-yellow-100 border-yellow-400",
  PROPOSAL: "bg-purple-100 border-purple-400",
  CLOSED: "bg-green-100 border-green-400",
};

// Activity type colors (for calendar, dsb)
// Digunakan untuk background event di kalender aktivitas
export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  MEETING: "#2563eb22", // Biru transparan: Meeting
  CALL: "#22c55e22", // Hijau transparan: Call
  DEMO: "#a21caf22", // Ungu transparan: Demo
  FOLLOWUP: "#f59e4222", // Oranye transparan: Follow Up
};
// Digunakan untuk border event di kalender aktivitas
export const ACTIVITY_TYPE_BORDERS: Record<string, string> = {
  MEETING: "#2563eb", // Biru: Meeting
  CALL: "#22c55e", // Hijau: Call
  DEMO: "#a21caf", // Ungu: Demo
  FOLLOWUP: "#f59e42", // Oranye: Follow Up
};

// Lead Status Colors untuk charts dan dashboard
// Mapping warna berdasarkan status lead untuk digunakan di chart
export const LEAD_STATUS_COLORS = {
  OPEN: "#3b82f6", // Blue
  CONTACTED: "#10b981", // Green
  PROPOSAL: "#a855f7", // Purple
  CLOSED: "#06b6d4", // Cyan
} as const;

// Chart Colors untuk light theme
// Array warna untuk chart yang mendukung multiple data series
export const CHART_COLORS = {
  PRIMARY: "#3b82f6", // Blue
  SECONDARY: "#10b981", // Green
  ACCENT: "#f97316", // Orange
  WARNING: "#ef4444", // Red
  INFO: "#a855f7", // Purple
  SUCCESS: "#06b6d4", // Cyan
  NEUTRAL: "#6b7280", // Gray
  PINK: "#ec4899", // Pink
} as const;

// Chart Colors untuk dark theme (lighter variants)
// Versi terang dari warna chart untuk dark mode
export const CHART_COLORS_DARK = {
  PRIMARY: "#60a5fa", // Light Blue
  SECONDARY: "#34d399", // Light Green
  ACCENT: "#fb923c", // Light Orange
  WARNING: "#f87171", // Light Red
  INFO: "#c084fc", // Light Purple
  SUCCESS: "#22d3ee", // Light Cyan
  NEUTRAL: "#9ca3af", // Light Gray
  PINK: "#f472b6", // Light Pink
} as const;

// Utility colors
// Digunakan untuk berbagai elemen UI: background, text, border, shadow, dsb
export const COLOR_WHITE = "#fff"; // Warna teks, badge, dsb
export const COLOR_BLACK = "#222"; // Warna teks utama, tooltip, dsb
export const COLOR_GRAY_LIGHT = "#f3f4f6"; // Background button, drag, dsb
export const COLOR_GRAY_MEDIUM = "#64748b"; // Border fallback, dsb
export const COLOR_SHADOW = "0 4px 16px rgba(0,0,0,0.15)"; // Shadow drag
export const COLOR_SHADOW_SOFT = "0 2px 8px #0002"; // Shadow tooltip
export const COLOR_BLUE_100 = "#dbeafe"; // Background fitur, dsb
export const COLOR_GREEN_100 = "#d1fae5"; // Background fitur, dsb
export const COLOR_YELLOW_100 = "#fef9c3"; // Background fitur, dsb
export const COLOR_PURPLE_100 = "#f3e8ff"; // Background fitur, dsb
export const COLOR_GRAY_50 = "#f9fafb"; // Background section, dsb
export const COLOR_BLUE_50 = "#eff6ff"; // Background section, dsb
export const COLOR_BLUE_600 = "#2563eb"; // Teks utama, border, dsb
export const COLOR_BLUE_700 = "#1d4ed8"; // Teks, border, dsb
export const COLOR_GRAY_500 = "#6b7280"; // Teks sekunder
export const COLOR_GRAY_600 = "#4b5563"; // Teks sekunder
export const COLOR_GRAY_700 = "#374151"; // Teks sekunder
export const COLOR_GRAY_100 = "#f3f4f6"; // Background, border
export const COLOR_GREEN_500 = "#10b981"; // Chart leads, dsb

// Transparan/utility
// Digunakan untuk background/button aktif, focus ring, dsb
export const COLOR_BLUE_22 = "#2563eb22"; // Biru transparan
export const COLOR_BLUE_33 = "#2563eb33"; // Biru transparan (focus ring)

// Lead status background dan border colors untuk pipeline
// Digunakan untuk styling kolom pipeline dengan background dan border yang sesuai
export const LEAD_STATUS_BG_BORDER = {
  OPEN: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
  CONTACTED: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  PROPOSAL: {
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
  },
  CLOSED: {
    bg: "bg-cyan-50 dark:bg-cyan-950",
    border: "border-cyan-200 dark:border-cyan-800",
    text: "text-cyan-700 dark:text-cyan-300",
  },
} as const;
