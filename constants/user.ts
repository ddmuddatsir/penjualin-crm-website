// constants/user.ts
// User-related constants

// User roles
export const USER_ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SALES_REP: "SALES_REP",
  SUPPORT: "SUPPORT",
  VIEWER: "VIEWER",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// User role options array
export const USER_ROLE_OPTIONS = Object.values(USER_ROLE);

// User role labels for UI display
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLE.ADMIN]: "Administrator",
  [USER_ROLE.MANAGER]: "Manager",
  [USER_ROLE.SALES_REP]: "Sales Representative",
  [USER_ROLE.SUPPORT]: "Support",
  [USER_ROLE.VIEWER]: "Viewer",
};

// User role permissions
export const USER_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [USER_ROLE.ADMIN]: [
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "leads.create",
    "leads.read",
    "leads.update",
    "leads.delete",
    "deals.create",
    "deals.read",
    "deals.update",
    "deals.delete",
    "activities.create",
    "activities.read",
    "activities.update",
    "activities.delete",
    "reports.read",
    "settings.update",
  ],
  [USER_ROLE.MANAGER]: [
    "users.read",
    "leads.create",
    "leads.read",
    "leads.update",
    "leads.delete",
    "deals.create",
    "deals.read",
    "deals.update",
    "deals.delete",
    "activities.create",
    "activities.read",
    "activities.update",
    "activities.delete",
    "reports.read",
  ],
  [USER_ROLE.SALES_REP]: [
    "leads.create",
    "leads.read",
    "leads.update",
    "deals.create",
    "deals.read",
    "deals.update",
    "activities.create",
    "activities.read",
    "activities.update",
  ],
  [USER_ROLE.SUPPORT]: [
    "leads.read",
    "activities.create",
    "activities.read",
    "activities.update",
  ],
  [USER_ROLE.VIEWER]: [
    "leads.read",
    "deals.read",
    "activities.read",
    "reports.read",
  ],
};

// User statuses
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

// User status options array
export const USER_STATUS_OPTIONS = Object.values(USER_STATUS);

// User status labels for UI display
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.INACTIVE]: "Inactive",
  [USER_STATUS.PENDING]: "Pending",
  [USER_STATUS.SUSPENDED]: "Suspended",
};
