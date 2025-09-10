// services/firebase/leadService.ts
import { where, orderBy, QueryConstraint } from "firebase/firestore";
import { FirebaseBaseService } from "./base";
import { FirestoreLead, ClientLead, COLLECTIONS } from "@/types/firebase";

/**
 * Lead service untuk operasi CRUD pada collection leads
 * Extends FirebaseBaseService dengan operasi khusus lead
 */
export class FirebaseLeadService extends FirebaseBaseService<ClientLead> {
  constructor() {
    super(COLLECTIONS.LEADS);
  }

  /**
   * Get leads by status
   */
  async getByStatus(status: FirestoreLead["status"]): Promise<ClientLead[]> {
    const constraints: QueryConstraint[] = [
      where("status", "==", status),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get leads assigned to user
   */
  async getByAssignedUser(userId: string): Promise<ClientLead[]> {
    const constraints: QueryConstraint[] = [
      where("assignedTo", "==", userId),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Get leads by source
   */
  async getBySource(source: FirestoreLead["source"]): Promise<ClientLead[]> {
    const constraints: QueryConstraint[] = [
      where("source", "==", source),
      orderBy("updatedAt", "desc"),
    ];
    return this.getAll(constraints);
  }

  /**
   * Search leads by name or company
   */
  async searchByNameOrCompany(searchTerm: string): Promise<ClientLead[]> {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or Elasticsearch
    try {
      const nameResults = await this.search("name", searchTerm);
      const companyResults = await this.search("company", searchTerm);

      // Combine and deduplicate results
      const allResults = [...nameResults, ...companyResults];
      const uniqueResults = allResults.filter(
        (lead, index, self) => self.findIndex((l) => l.id === lead.id) === index
      );

      return uniqueResults;
    } catch (error) {
      console.error("Error searching leads:", error);
      throw error;
    }
  }

  /**
   * Get leads with filters
   */
  async getWithFilters(filters: {
    status?: FirestoreLead["status"];
    source?: FirestoreLead["source"];
    assignedTo?: string;
    search?: string;
  }): Promise<ClientLead[]> {
    const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];

    // Add where clauses based on filters
    if (filters.status) {
      constraints.unshift(where("status", "==", filters.status));
    }

    if (filters.source) {
      constraints.unshift(where("source", "==", filters.source));
    }

    if (filters.assignedTo) {
      constraints.unshift(where("assignedTo", "==", filters.assignedTo));
    }

    let results = await this.getAll(constraints);

    // Client-side search for name/company if search term provided
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  /**
   * Update lead status
   */
  async updateStatus(
    id: string,
    status: FirestoreLead["status"]
  ): Promise<void> {
    await this.update(id, { status });
  }

  /**
   * Assign lead to user
   */
  async assignToUser(id: string, userId: string): Promise<void> {
    await this.update(id, { assignedTo: userId });
  }

  /**
   * Get leads dashboard metrics
   */
  async getDashboardMetrics(): Promise<{
    total: number;
    byStatus: Record<FirestoreLead["status"], number>;
    bySource: Record<string, number>;
    recentLeads: ClientLead[];
  }> {
    try {
      const allLeads = await this.getAll([orderBy("createdAt", "desc")]);

      const byStatus = {
        OPEN: 0,
        CONTACTED: 0,
        PROPOSAL: 0,
        CLOSED: 0,
      } as Record<FirestoreLead["status"], number>;

      const bySource: Record<string, number> = {};

      allLeads.forEach((lead) => {
        byStatus[lead.status]++;

        const source = lead.source || "OTHER";
        bySource[source] = (bySource[source] || 0) + 1;
      });

      const recentLeads = allLeads.slice(0, 10);

      return {
        total: allLeads.length,
        byStatus,
        bySource,
        recentLeads,
      };
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      throw error;
    }
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(): Promise<
    Array<{
      stage: string;
      count: number;
      percentage: number;
    }>
  > {
    try {
      const metrics = await this.getDashboardMetrics();
      const total = metrics.total;

      return [
        {
          stage: "Open",
          count: metrics.byStatus.OPEN,
          percentage: total > 0 ? (metrics.byStatus.OPEN / total) * 100 : 0,
        },
        {
          stage: "Contacted",
          count: metrics.byStatus.CONTACTED,
          percentage:
            total > 0 ? (metrics.byStatus.CONTACTED / total) * 100 : 0,
        },
        {
          stage: "Proposal",
          count: metrics.byStatus.PROPOSAL,
          percentage: total > 0 ? (metrics.byStatus.PROPOSAL / total) * 100 : 0,
        },
        {
          stage: "Closed",
          count: metrics.byStatus.CLOSED,
          percentage: total > 0 ? (metrics.byStatus.CLOSED / total) * 100 : 0,
        },
      ];
    } catch (error) {
      console.error("Error getting conversion funnel:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const leadService = new FirebaseLeadService();
