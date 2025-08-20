/**
 * Sidebar configuration constants dengan Shadcn components
 * Centralized place untuk semua nilai-nilai yang digunakan di sidebar
 */
export const SIDEBAR_CONFIG = {
  // Dimensions
  WIDTH: "w-56",

  // Layout classes - Updated untuk Shadcn Sheet
  DESKTOP_CLASSES:
    "hidden md:flex flex-col sticky top-0 h-screen bg-background border-r px-4 py-8 gap-2",

  // Sheet (Mobile) classes - Menggunakan Shadcn Sheet
  MOBILE_SHEET_CLASSES: "w-[280px] sm:w-[300px]",
  MOBILE_TRIGGER_CLASSES: "md:hidden fixed top-4 left-4 z-50",
  MOBILE_TRIGGER_BUTTON_CLASSES: "h-10 w-10",

  // Brand styling - Updated untuk theme support
  BRAND_CLASSES: "font-bold text-xl mb-8 text-primary",
  BRAND_NAME: "PenjualinCRM",

  // User section styling - Updated untuk Separator component
  USER_SECTION_CLASSES: "pt-4 mt-4", // Separator akan handle border
  USER_INFO_CLASSES: "flex items-center gap-3 px-3 py-2 mb-2",
  USER_NAME_CLASSES: "text-sm font-medium text-foreground truncate",
  USER_EMAIL_CLASSES: "text-xs text-muted-foreground truncate",

  // Avatar classes untuk Shadcn Avatar
  AVATAR_CLASSES: "h-8 w-8",
  AVATAR_FALLBACK_CLASSES: "bg-primary text-primary-foreground text-xs",

  // Logout button styling - Updated untuk Button variant
  LOGOUT_BUTTON_CLASSES:
    "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",

  // Navigation styling - Updated untuk Navigation components
  NAV_CLASSES: "flex flex-col gap-1 flex-1",
  MENU_CONTAINER_CLASSES: "flex flex-col h-full",

  // Navigation Menu Item classes - Updated untuk Button variants
  NAV_ITEM_CLASSES: "w-full justify-start h-10 px-3",
  NAV_ITEM_ACTIVE_CLASSES: "bg-accent text-accent-foreground",
  NAV_ITEM_INACTIVE_CLASSES:
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",

  // Icon sizes
  MENU_ICON_SIZE: "w-5 h-5",
  USER_ICON_SIZE: "w-4 h-4",
  LOGOUT_ICON_SIZE: "w-4 h-4",
  MOBILE_TRIGGER_ICON_SIZE: "w-5 h-5",

  // Separator classes
  SEPARATOR_CLASSES: "my-4",

  // Sheet specific classes
  SHEET_CONTENT_CLASSES: "flex flex-col h-full",
  SHEET_HEADER_CLASSES: "border-b pb-4 mb-4",
} as const;

/**
 * Sidebar menu items configuration
 */
export const SIDEBAR_MENU_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: "Users",
  },
  {
    title: "Deals",
    href: "/dashboard/deals",
    icon: "Handshake",
  },
  {
    title: "Activities",
    href: "/dashboard/activities",
    icon: "Calendar",
  },
  {
    title: "Pipeline",
    href: "/dashboard/pipeline",
    icon: "GitBranch",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "BarChart3",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
] as const;

/**
 * Z-index values untuk layering
 */
export const SIDEBAR_Z_INDEX = {
  MOBILE_TRIGGER: "z-50",
  SHEET_OVERLAY: "z-50",
} as const;

/**
 * Animation durations untuk Sheet
 */
export const SIDEBAR_ANIMATIONS = {
  SHEET_ENTER_DURATION: "duration-500",
  SHEET_EXIT_DURATION: "duration-300",
} as const;
