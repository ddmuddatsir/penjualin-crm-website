/**
 * Global type definitions for CRM SaaS Application
 */

declare global {
  type ID = string;
  type Timestamp = Date;

  interface BaseEntity {
    id?: ID;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }

  type Status = "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED";
  type UserRole = "admin" | "manager" | "sales" | "user";
  type DealStatus =
    | "OPEN"
    | "NEGOTIATION"
    | "PROPOSAL_SENT"
    | "ON_HOLD"
    | "WON"
    | "LOST";
  type ActivityType = "MEETING" | "CALL" | "DEMO" | "EMAIL";
}

export {};
