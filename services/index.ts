// services/index.ts
// Export Firebase services

export * from "./api";
export { leadService } from "./firebase/leadService";
export { dealService } from "./firebase/dealService";
export { activityService } from "./firebase/activityService";
export { authService } from "./firebase/authService";
export { reportsService } from "./firebase/reportsService";
export { usersService } from "./firebase/usersService";

// Re-export for convenience
export { apiService as api } from "./api";
export { leadService as leads } from "./firebase/leadService";
export { dealService as deals } from "./firebase/dealService";
export { activityService as activities } from "./firebase/activityService";
export { authService as auth } from "./firebase/authService";
export { reportsService as reports } from "./firebase/reportsService";
export { usersService as users } from "./firebase/usersService";

// Re-export types for convenience
export type {
  FirestoreLead,
  FirestoreActivity,
  FirestoreDeal,
  FirestoreUser,
  FirestoreReport,
  ClientLead,
  ClientActivity,
  ClientDeal,
  ClientUser,
  ClientReport,
} from "@/types/firebase";
