// types/firebase.ts
import { Timestamp } from "firebase/firestore";

// Base interface for all documents
interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Lead interface for Firestore
export interface FirestoreLead extends BaseDocument {
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED";
  source?:
    | "WEBSITE"
    | "PHONE"
    | "EMAIL"
    | "REFERRAL"
    | "SOCIAL"
    | "MANUAL"
    | "OTHER";
  value?: number;
  notes?: string;
  assignedTo?: string; // User ID
  tags?: string[];
  customFields?: Record<string, unknown>;
}

// Activity interface for Firestore
export interface FirestoreActivity extends BaseDocument {
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK" | "OTHER";
  description: string;
  leadId?: string;
  dealId?: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

// Deal interface for Firestore
export interface FirestoreDeal extends BaseDocument {
  title: string;
  description?: string;
  value: number;
  stage:
    | "PROSPECTING"
    | "QUALIFICATION"
    | "PROPOSAL"
    | "NEGOTIATION"
    | "CLOSED_WON"
    | "CLOSED_LOST";
  leadId?: string;
  assignedTo?: string;
  expectedCloseDate?: Timestamp;
  probability?: number; // 0-100
  tags?: string[];
  customFields?: Record<string, unknown>;
}

// User interface for Firestore
export interface FirestoreUser extends BaseDocument {
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "SALES_REP";
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Timestamp;
  settings?: {
    timezone: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
}

// Report interface for Firestore
export interface FirestoreReport extends BaseDocument {
  type: "LEAD_CONVERSION" | "SALES_PERFORMANCE" | "ACTIVITY_SUMMARY";
  title: string;
  description?: string;
  data: Record<string, unknown>; // JSON data for the report
  userId: string;
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
  isPublic: boolean;
}

// Collection names constants
export const COLLECTIONS = {
  LEADS: "leads",
  ACTIVITIES: "activities",
  DEALS: "deals",
  USERS: "users",
  REPORTS: "reports",
} as const;

// Utility type to convert Firestore timestamp to Date
export type FirestoreToClient<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? Date
    : T[K] extends { start: Timestamp; end: Timestamp }
    ? { start: Date; end: Date }
    : T[K];
};

// Convert Firestore documents to client-side format
export type ClientLead = FirestoreToClient<FirestoreLead>;
export type ClientActivity = FirestoreToClient<FirestoreActivity>;
export type ClientDeal = FirestoreToClient<FirestoreDeal>;
export type ClientUser = FirestoreToClient<FirestoreUser>;
export type ClientReport = FirestoreToClient<FirestoreReport>;
