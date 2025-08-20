// services/firebase/dealService.ts
import {
  where,
  orderBy,
  QueryConstraint,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { FirebaseBaseService } from "./base";
import { FirestoreDeal, ClientDeal, COLLECTIONS } from "@/types/firebase";

/**
 * Deal service untuk operasi CRUD pada collection deals
 * Extends FirebaseBaseService dengan operasi khusus deal
 */
export class FirebaseDealService extends FirebaseBaseService<ClientDeal> {
  constructor() {
    super(COLLECTIONS.DEALS);
  }

  /**
   * Override docToData to handle deal-specific timestamp conversions
   */
  protected docToData(
    doc: QueryDocumentSnapshot | DocumentSnapshot
  ): ClientDeal {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Timestamps to Dates
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
      expectedCloseDate: data?.expectedCloseDate?.toDate(),
    } as unknown as ClientDeal;
  }

  /**
   * Get deals by stage
   */
  async getByStage(stage: FirestoreDeal["stage"]): Promise<ClientDeal[]> {
    const constraints: QueryConstraint[] = [
      where("stage", "==", stage),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get deals by assigned user
   */
  async getByAssignedUser(userId: string): Promise<ClientDeal[]> {
    const constraints: QueryConstraint[] = [
      where("assignedTo", "==", userId),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get deals by lead ID
   */
  async getByLeadId(leadId: string): Promise<ClientDeal[]> {
    const constraints: QueryConstraint[] = [
      where("leadId", "==", leadId),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get deals by value range
   */
  async getByValueRange(
    minValue: number,
    maxValue: number
  ): Promise<ClientDeal[]> {
    const constraints: QueryConstraint[] = [
      where("value", ">=", minValue),
      where("value", "<=", maxValue),
      orderBy("value", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get deals with filters
   */
  async getWithFilters(filters: {
    stage?: FirestoreDeal["stage"];
    assignedTo?: string;
    leadId?: string;
    minValue?: number;
    maxValue?: number;
    search?: string;
  }): Promise<ClientDeal[]> {
    const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];

    // Add where clauses based on filters
    if (filters.stage) {
      constraints.unshift(where("stage", "==", filters.stage));
    }

    if (filters.assignedTo) {
      constraints.unshift(where("assignedTo", "==", filters.assignedTo));
    }

    if (filters.leadId) {
      constraints.unshift(where("leadId", "==", filters.leadId));
    }

    let results = await this.getAll(constraints);

    // Client-side filtering for value range and search
    if (filters.minValue !== undefined) {
      results = results.filter((deal) => deal.value >= filters.minValue!);
    }

    if (filters.maxValue !== undefined) {
      results = results.filter((deal) => deal.value <= filters.maxValue!);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchLower) ||
          deal.description?.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  /**
   * Update deal stage
   */
  async updateStage(id: string, stage: FirestoreDeal["stage"]): Promise<void> {
    await this.update(id, { stage });
  }

  /**
   * Update deal value
   */
  async updateValue(id: string, value: number): Promise<void> {
    await this.update(id, { value });
  }

  /**
   * Assign deal to user
   */
  async assignToUser(id: string, userId: string): Promise<void> {
    await this.update(id, { assignedTo: userId });
  }

  /**
   * Update deal close date
   */
  async updateCloseDate(id: string, closeDate: Date): Promise<void> {
    await this.update(id, { expectedCloseDate: Timestamp.fromDate(closeDate) });
  }

  /**
   * Get pipeline data for dashboard
   */
  async getPipelineData(): Promise<{
    stages: Array<{
      stage: FirestoreDeal["stage"];
      deals: ClientDeal[];
      totalValue: number;
      count: number;
    }>;
    totalValue: number;
    totalDeals: number;
  }> {
    try {
      const allDeals = await this.getAll([orderBy("updatedAt", "desc")]);

      const stages = [
        "PROSPECTING",
        "QUALIFICATION",
        "PROPOSAL",
        "NEGOTIATION",
        "CLOSED_WON",
        "CLOSED_LOST",
      ] as const;

      const pipelineStages = stages.map((stage) => {
        const stageDeals = allDeals.filter((deal) => deal.stage === stage);
        const totalValue = stageDeals.reduce(
          (sum, deal) => sum + deal.value,
          0
        );

        return {
          stage,
          deals: stageDeals,
          totalValue,
          count: stageDeals.length,
        };
      });

      const totalValue = allDeals.reduce((sum, deal) => sum + deal.value, 0);
      const totalDeals = allDeals.length;

      return {
        stages: pipelineStages,
        totalValue,
        totalDeals,
      };
    } catch (error) {
      console.error("Error getting pipeline data:", error);
      throw error;
    }
  }

  /**
   * Get deals dashboard metrics
   */
  async getDashboardMetrics(): Promise<{
    total: number;
    totalValue: number;
    byStage: Record<FirestoreDeal["stage"], { count: number; value: number }>;
    wonDeals: { count: number; value: number };
    lostDeals: { count: number; value: number };
    avgDealValue: number;
    recentDeals: ClientDeal[];
  }> {
    try {
      const allDeals = await this.getAll([orderBy("createdAt", "desc")]);

      const byStage = {
        PROSPECTING: { count: 0, value: 0 },
        QUALIFICATION: { count: 0, value: 0 },
        PROPOSAL: { count: 0, value: 0 },
        NEGOTIATION: { count: 0, value: 0 },
        CLOSED_WON: { count: 0, value: 0 },
        CLOSED_LOST: { count: 0, value: 0 },
      } as Record<FirestoreDeal["stage"], { count: number; value: number }>;

      let totalValue = 0;

      allDeals.forEach((deal) => {
        byStage[deal.stage].count++;
        byStage[deal.stage].value += deal.value;
        totalValue += deal.value;
      });

      const wonDeals = {
        count: byStage.CLOSED_WON.count,
        value: byStage.CLOSED_WON.value,
      };

      const lostDeals = {
        count: byStage.CLOSED_LOST.count,
        value: byStage.CLOSED_LOST.value,
      };

      const avgDealValue =
        allDeals.length > 0 ? totalValue / allDeals.length : 0;
      const recentDeals = allDeals.slice(0, 10);

      return {
        total: allDeals.length,
        totalValue,
        byStage,
        wonDeals,
        lostDeals,
        avgDealValue,
        recentDeals,
      };
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      throw error;
    }
  }

  /**
   * Get conversion rates
   */
  async getConversionRates(): Promise<
    Array<{
      fromStage: string;
      toStage: string;
      rate: number;
      count: number;
    }>
  > {
    try {
      // This would require activity tracking for stage changes
      // For now, return basic conversion data based on current state
      const allDeals = await this.getAll();

      const stageOrder = [
        "PROSPECTING",
        "QUALIFICATION",
        "PROPOSAL",
        "NEGOTIATION",
        "CLOSED_WON",
      ];

      const conversions = [];

      for (let i = 0; i < stageOrder.length - 1; i++) {
        const fromStage = stageOrder[i];
        const toStage = stageOrder[i + 1];

        const fromCount = allDeals.filter(
          (deal) => stageOrder.indexOf(deal.stage) >= i
        ).length;

        const toCount = allDeals.filter(
          (deal) => stageOrder.indexOf(deal.stage) >= i + 1
        ).length;

        const rate = fromCount > 0 ? (toCount / fromCount) * 100 : 0;

        conversions.push({
          fromStage,
          toStage,
          rate,
          count: toCount,
        });
      }

      return conversions;
    } catch (error) {
      console.error("Error getting conversion rates:", error);
      throw error;
    }
  }

  /**
   * Get deals forecast
   */
  async getForecast(): Promise<{
    thisMonth: { value: number; count: number };
    nextMonth: { value: number; count: number };
    thisQuarter: { value: number; count: number };
    nextQuarter: { value: number; count: number };
  }> {
    try {
      const allDeals: ClientDeal[] = await this.getAll();
      const now = new Date();

      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      const thisQuarter = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      const nextQuarter = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3 + 3,
        1
      );
      const endOfNextQuarter = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3 + 6,
        0
      );

      const thisMonthDeals = allDeals.filter(
        (deal) =>
          deal.expectedCloseDate &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) >=
            thisMonth.getTime() &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) <
            nextMonth.getTime() &&
          deal.stage !== "CLOSED_LOST"
      );

      const nextMonthDeals = allDeals.filter(
        (deal) =>
          deal.expectedCloseDate &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) >=
            nextMonth.getTime() &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) <=
            endOfNextMonth.getTime() &&
          deal.stage !== "CLOSED_LOST"
      );

      const thisQuarterDeals = allDeals.filter(
        (deal) =>
          deal.expectedCloseDate &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) >=
            thisQuarter.getTime() &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) <
            nextQuarter.getTime() &&
          deal.stage !== "CLOSED_LOST"
      );

      const nextQuarterDeals = allDeals.filter(
        (deal) =>
          deal.expectedCloseDate &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) >=
            nextQuarter.getTime() &&
          (deal.expectedCloseDate instanceof Date
            ? deal.expectedCloseDate.getTime()
            : (deal.expectedCloseDate as Timestamp).toDate().getTime()) <=
            endOfNextQuarter.getTime() &&
          deal.stage !== "CLOSED_LOST"
      );

      return {
        thisMonth: {
          value: thisMonthDeals.reduce((sum, deal) => sum + deal.value, 0),
          count: thisMonthDeals.length,
        },
        nextMonth: {
          value: nextMonthDeals.reduce((sum, deal) => sum + deal.value, 0),
          count: nextMonthDeals.length,
        },
        thisQuarter: {
          value: thisQuarterDeals.reduce((sum, deal) => sum + deal.value, 0),
          count: thisQuarterDeals.length,
        },
        nextQuarter: {
          value: nextQuarterDeals.reduce((sum, deal) => sum + deal.value, 0),
          count: nextQuarterDeals.length,
        },
      };
    } catch (error) {
      console.error("Error getting forecast:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const dealService = new FirebaseDealService();
