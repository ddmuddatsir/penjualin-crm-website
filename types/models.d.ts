/**
 * Data Models for CRM SaaS Application
 */

export interface User extends BaseEntity {
  id: string; // Make id required for User
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead extends BaseEntity {
  id: string; // Make id required for Lead
  name: string;
  company: string;
  email: string;
  status: "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED";
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
}

export interface Deal extends BaseEntity {
  leadId: string;
  dealValue: number;
  status: DealStatus;
  closedAt?: string | null;
  lead?: {
    id: string;
    name: string;
    company: string;
    email: string;
    status: string;
    assignedTo?: { id: string; name: string; email: string } | null;
  };
}

export interface Activity extends BaseEntity {
  id: string; // Make id required for Activity
  type: ActivityType;
  title: string;
  leadId: string;
  userId: string;
  notes?: string;
  date: string;
  lead?: { id: string; name: string };
}

// Export ActivityType
export type ActivityType =
  | "MEETING"
  | "CALL"
  | "DEMO"
  | "EMAIL"
  | "TASK"
  | "NOTE";

// Specialized types for different contexts
export interface DashboardActivityType {
  id: string;
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK" | "OTHER";
  description: string;
  leadId?: string;
  dealId?: string;
  userId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadType {
  id: string;
  name: string;
  email: string;
  status: string;
  assignedTo?: { id: string; name: string; email: string };
  createdAt: string;
}

// Utility Types
export type ActivityCalendarEvent = {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: { activity: Activity };
};

export type LeadFilters = {
  q: string;
  status: string;
  owner: string;
  date: string;
};

export interface ActivityForm {
  type: ActivityType;
  title: string;
  leadId: string;
  userId: string;
  notes: string;
}

export interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
}

export interface EditRole {
  id: string;
  role: string;
}
