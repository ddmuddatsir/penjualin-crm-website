// services/firebase/index.ts
export { FirebaseBaseService } from "./base";
export { FirebaseLeadService, leadService } from "./leadService";
export { FirebaseActivityService, activityService } from "./activityService";
export { FirebaseDealService, dealService } from "./dealService";
export { FirebaseAuthService, authService } from "./authService";
export { reportsService } from "./reportsService";
export { usersService } from "./usersService";

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

// Import for convenience object
import { authService } from "./authService";
import { leadService } from "./leadService";
import { dealService } from "./dealService";
import { activityService } from "./activityService";
import { usersService } from "./usersService";
import { reportsService } from "./reportsService";

// Convenience object for organized access
export const firebase = {
  auth: authService,
  leads: leadService,
  deals: dealService,
  activities: activityService,
  users: usersService,
  reports: reportsService,
};

export default firebase;
