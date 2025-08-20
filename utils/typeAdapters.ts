// utils/typeAdapters.ts
import type {
  ClientLead,
  ClientDeal,
  ClientActivity,
  ClientUser,
} from "@/types/firebase";
import type { Lead, Deal, Activity, User } from "@/types/models";

// Convert Firebase ClientLead to application Lead type
export const adaptFirebaseLeadToAppLead = (firebaseLead: ClientLead): Lead => {
  return {
    id: firebaseLead.id,
    name: firebaseLead.name,
    company: firebaseLead.company,
    email: firebaseLead.email,
    status: firebaseLead.status,
    assignedToId: firebaseLead.assignedTo || null,
    assignedTo: null, // Will be populated by joining with users if needed
    createdAt: firebaseLead.createdAt,
    updatedAt: firebaseLead.updatedAt,
  };
};

// Convert Firebase ClientDeal to application Deal type
export const adaptFirebaseDealToAppDeal = (firebaseDeal: ClientDeal): Deal => {
  return {
    id: firebaseDeal.id,
    leadId: firebaseDeal.leadId || "",
    dealValue: firebaseDeal.value,
    status: firebaseDeal.stage as
      | "OPEN"
      | "NEGOTIATION"
      | "PROPOSAL_SENT"
      | "ON_HOLD"
      | "WON"
      | "LOST", // Map stage to status
    closedAt: null, // Calculate from stage and updatedAt if needed
    createdAt: firebaseDeal.createdAt,
    updatedAt: firebaseDeal.updatedAt,
  };
};

// Convert Firebase ClientActivity to application Activity type
export const adaptFirebaseActivityToAppActivity = (
  firebaseActivity: ClientActivity
): Activity => {
  return {
    id: firebaseActivity.id,
    type: firebaseActivity.type as "CALL" | "EMAIL" | "MEETING" | "NOTE",
    title: firebaseActivity.description, // Map description to title
    leadId: firebaseActivity.leadId || "",
    userId: firebaseActivity.userId,
    notes: firebaseActivity.description,
    date: firebaseActivity.createdAt.toISOString().split("T")[0], // Convert to date string
    createdAt: firebaseActivity.createdAt,
    updatedAt: firebaseActivity.updatedAt,
  };
};

// Convert Firebase ClientUser to application User type
export const adaptFirebaseUserToAppUser = (firebaseUser: ClientUser): User => {
  return {
    id: firebaseUser.id,
    name: firebaseUser.name,
    email: firebaseUser.email,
    role: firebaseUser.role as "admin" | "manager" | "sales" | "user",
    createdAt: firebaseUser.createdAt,
    updatedAt: firebaseUser.updatedAt,
  };
};

// Batch converters
export const adaptFirebaseLeadsToAppLeads = (
  firebaseLeads: ClientLead[]
): Lead[] => {
  return firebaseLeads.map(adaptFirebaseLeadToAppLead);
};

export const adaptFirebaseDealsToAppDeals = (
  firebaseDeals: ClientDeal[]
): Deal[] => {
  return firebaseDeals.map(adaptFirebaseDealToAppDeal);
};

export const adaptFirebaseActivitiesToAppActivities = (
  firebaseActivities: ClientActivity[]
): Activity[] => {
  return firebaseActivities.map(adaptFirebaseActivityToAppActivity);
};

export const adaptFirebaseUsersToAppUsers = (
  firebaseUsers: ClientUser[]
): User[] => {
  return firebaseUsers.map(adaptFirebaseUserToAppUser);
};
