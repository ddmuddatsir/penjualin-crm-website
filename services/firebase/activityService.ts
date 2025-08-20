// services/firebase/activityService.ts
import { where, orderBy, limit, QueryConstraint } from "firebase/firestore";
import { FirebaseBaseService } from "./base";
import {
  FirestoreActivity,
  ClientActivity,
  COLLECTIONS,
} from "@/types/firebase";

/**
 * Activity service untuk operasi CRUD pada collection activities
 * Extends FirebaseBaseService dengan operasi khusus activity
 */
export class FirebaseActivityService extends FirebaseBaseService<ClientActivity> {
  constructor() {
    super(COLLECTIONS.ACTIVITIES);
  }

  /**
   * Get activities by lead ID
   */
  async getByLeadId(leadId: string): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      where("leadId", "==", leadId),
      orderBy("createdAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get activities by deal ID
   */
  async getByDealId(dealId: string): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      where("dealId", "==", dealId),
      orderBy("createdAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get activities by user ID
   */
  async getByUserId(userId: string): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get activities by type
   */
  async getByType(type: FirestoreActivity["type"]): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      where("type", "==", type),
      orderBy("createdAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get recent activities with limit
   */
  async getRecent(limitCount = 10): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(limitCount),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get activities timeline for specific entity
   */
  async getTimeline(
    entityId: string,
    entityType: "lead" | "deal"
  ): Promise<ClientActivity[]> {
    const fieldName = entityType === "lead" ? "leadId" : "dealId";
    const constraints: QueryConstraint[] = [
      where(fieldName, "==", entityId),
      orderBy("createdAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get activities with filters
   */
  async getWithFilters(filters: {
    leadId?: string;
    dealId?: string;
    userId?: string;
    type?: FirestoreActivity["type"];
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    // Add where clauses based on filters
    if (filters.leadId) {
      constraints.unshift(where("leadId", "==", filters.leadId));
    }

    if (filters.dealId) {
      constraints.unshift(where("dealId", "==", filters.dealId));
    }

    if (filters.userId) {
      constraints.unshift(where("userId", "==", filters.userId));
    }

    if (filters.type) {
      constraints.unshift(where("type", "==", filters.type));
    }

    let results = await this.getAll(constraints);

    // Client-side date filtering (Firestore range queries have limitations)
    if (filters.dateFrom || filters.dateTo) {
      results = results.filter((activity) => {
        const activityDate = activity.createdAt;

        if (filters.dateFrom && activityDate < filters.dateFrom) {
          return false;
        }

        if (filters.dateTo && activityDate > filters.dateTo) {
          return false;
        }

        return true;
      });
    }

    return results;
  }

  /**
   * Create activity with automatic metadata
   */
  async createActivity(
    activityData: Omit<FirestoreActivity, "id" | "createdAt" | "updatedAt">
  ): Promise<ClientActivity> {
    const activityId = await this.create(activityData);
    const newActivity = await this.getById(activityId);
    if (!newActivity) {
      throw new Error("Failed to retrieve created activity");
    }
    return newActivity;
  }
  /**
   * Log lead activity
   */
  async logLeadActivity(
    leadId: string,
    userId: string,
    type: FirestoreActivity["type"],
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<ClientActivity> {
    return this.createActivity({
      leadId,
      userId,
      type,
      description,
      metadata: metadata || {},
    });
  }

  /**
   * Log deal activity
   */
  async logDealActivity(
    dealId: string,
    userId: string,
    type: FirestoreActivity["type"],
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<ClientActivity> {
    return this.createActivity({
      dealId,
      userId,
      type,
      description,
      metadata: metadata || {},
    });
  }

  /**
   * Get activity statistics
   */
  async getStatistics(userId?: string): Promise<{
    total: number;
    byType: Record<FirestoreActivity["type"], number>;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    try {
      const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

      if (userId) {
        constraints.unshift(where("userId", "==", userId));
      }

      const allActivities = await this.getAll(constraints);

      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const byType = {
        CALL: 0,
        EMAIL: 0,
        MEETING: 0,
        NOTE: 0,
        TASK: 0,
        OTHER: 0,
      } as Record<FirestoreActivity["type"], number>;

      let today = 0;
      let thisWeek = 0;
      let thisMonth = 0;

      allActivities.forEach((activity) => {
        byType[activity.type]++;

        if (activity.createdAt >= startOfDay) {
          today++;
        }

        if (activity.createdAt >= startOfWeek) {
          thisWeek++;
        }

        if (activity.createdAt >= startOfMonth) {
          thisMonth++;
        }
      });

      return {
        total: allActivities.length,
        byType,
        today,
        thisWeek,
        thisMonth,
      };
    } catch (error) {
      console.error("Error getting activity statistics:", error);
      throw error;
    }
  }

  /**
   * Get activity feed for dashboard
   */
  async getActivityFeed(limitCount = 20): Promise<ClientActivity[]> {
    const constraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(limitCount),
    ];
    return this.getAll(constraints);
  }

  /**
   * Bulk create activities
   */
  async bulkCreate(
    activities: Array<Omit<FirestoreActivity, "id" | "createdAt" | "updatedAt">>
  ): Promise<ClientActivity[]> {
    const results: ClientActivity[] = [];

    for (const activityData of activities) {
      const activity = await this.createActivity(activityData);
      results.push(activity);
    }

    return results;
  }
}

// Create singleton instance
export const activityService = new FirebaseActivityService();
