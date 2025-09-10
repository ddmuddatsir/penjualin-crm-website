// services/firebase/reportsService.ts
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import type {
  FirestoreReport,
  ClientReport,
  FirestoreDeal,
  FirestoreLead,
  FirestoreActivity,
} from "@/types/firebase";

// Type definitions for analytics
interface MonthlyData {
  month: string;
  deals: number;
  revenue: number;
  closed: number;
}

interface LeadMonthlyData {
  month: string;
  leads: number;
  qualified: number;
  converted: number;
}

interface ActivityMonthlyData {
  month: string;
  activities: number;
  calls: number;
  emails: number;
  meetings: number;
}

class ReportsService {
  private collectionName = "reports";

  // Convert Firestore data to client format
  private convertFirestoreToClient(doc: DocumentSnapshot): ClientReport | null {
    if (!doc.exists()) return null;

    const data = doc.data() as FirestoreReport;
    return {
      id: doc.id,
      type: data.type,
      title: data.title,
      description: data.description,
      data: data.data,
      userId: data.userId,
      dateRange: {
        start: data.dateRange.start.toDate(),
        end: data.dateRange.end.toDate(),
      },
      isPublic: data.isPublic,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate() || data.createdAt.toDate(),
    };
  }

  private convertQuerySnapshot(snapshot: QuerySnapshot): ClientReport[] {
    return snapshot.docs
      .map((doc) => this.convertFirestoreToClient(doc))
      .filter((report): report is ClientReport => report !== null);
  }

  // Get all reports
  async getAll(): Promise<ClientReport[]> {
    try {
      const reportsRef = collection(db, this.collectionName);
      const q = query(reportsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return this.convertQuerySnapshot(snapshot);
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw new Error("Failed to fetch reports");
    }
  }

  // Get reports by type
  async getByType(type: string): Promise<ClientReport[]> {
    try {
      const reportsRef = collection(db, this.collectionName);
      const q = query(
        reportsRef,
        where("type", "==", type),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return this.convertQuerySnapshot(snapshot);
    } catch (error) {
      console.error("Error fetching reports by type:", error);
      throw new Error("Failed to fetch reports by type");
    }
  }

  // Get reports by date range
  async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ClientReport[]> {
    try {
      const reportsRef = collection(db, this.collectionName);
      const q = query(
        reportsRef,
        where("dateRange.start", ">=", Timestamp.fromDate(startDate)),
        where("dateRange.end", "<=", Timestamp.fromDate(endDate)),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return this.convertQuerySnapshot(snapshot);
    } catch (error) {
      console.error("Error fetching reports by date range:", error);
      throw new Error("Failed to fetch reports by date range");
    }
  }

  // Get report by ID
  async getById(id: string): Promise<ClientReport | null> {
    try {
      const reportRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(reportRef);
      return this.convertFirestoreToClient(snapshot);
    } catch (error) {
      console.error("Error fetching report by ID:", error);
      throw new Error("Failed to fetch report");
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalLeads: number;
    totalDeals: number;
    totalActivities: number;
    revenueThisMonth: number;
    conversionRate: number;
  }> {
    try {
      // This would typically aggregate data from leads, deals, and activities collections
      // For now, return mock data - you should implement actual aggregation logic
      return {
        totalLeads: 0,
        totalDeals: 0,
        totalActivities: 0,
        revenueThisMonth: 0,
        conversionRate: 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      throw new Error("Failed to fetch dashboard metrics");
    }
  }

  // Add missing methods for dashboard and reports hooks
  async getDashboardData() {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const [
        realTimeMetrics,
        salesPerformance,
        leadAnalytics,
        activityAnalytics,
        recentLeads,
        recentActivities,
      ] = await Promise.all([
        this.getRealTimeMetrics(),
        this.getSalesPerformance(thirtyDaysAgo, now),
        this.getLeadAnalytics(thirtyDaysAgo, now),
        this.getActivityAnalytics(thirtyDaysAgo, now),
        this.getRecentLeads(5),
        this.getRecentActivities(5),
      ]);

      return {
        realTime: realTimeMetrics,
        sales: salesPerformance,
        leads: leadAnalytics,
        activities: activityAnalytics,
        leadsTerbaru: recentLeads,
        activitiesTerakhir: recentActivities,
        // Additional dashboard analytics
        dailyLeads: await this.getDailyLeads(),
        monthlyDeals: await this.getMonthlyDeals(),
        monthlyLeads: await this.getMonthlyLeads(),
        leadStatusDistribution: await this.getLeadStatusDistribution(),
        conversionFunnel: await this.getConversionFunnel(),
        dateRange: {
          start: thirtyDaysAgo.toISOString(),
          end: now.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error getting dashboard data:", error);
      throw error;
    }
  }

  async getRealTimeMetrics() {
    try {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7); // 7 hari terakhir
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get today's activities
      const todayActivitiesQuery = query(
        collection(db, "activities"),
        where("createdAt", ">=", Timestamp.fromDate(startOfToday))
      );
      const todayActivitiesSnapshot = await getDocs(todayActivitiesQuery);

      // Get new leads from last 7 days
      const last7DaysLeadsQuery = query(
        collection(db, "leads"),
        where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo))
      );
      const last7DaysLeadsSnapshot = await getDocs(last7DaysLeadsQuery);

      // Get this month's closed deals
      const thisMonthDealsQuery = query(
        collection(db, "deals"),
        where("stage", "==", "CLOSED_WON"),
        where("createdAt", ">=", Timestamp.fromDate(startOfMonth))
      );
      const thisMonthDealsSnapshot = await getDocs(thisMonthDealsQuery);

      // Calculate total revenue this month
      let totalRevenue = 0;
      thisMonthDealsSnapshot.docs.forEach((doc) => {
        const deal = doc.data() as FirestoreDeal;
        totalRevenue += deal.value || 0; // Handle undefined values
      });

      console.log("📊 Dashboard Metrics:", {
        todayActivities: todayActivitiesSnapshot.size,
        thisWeekLeads: last7DaysLeadsSnapshot.size,
        thisMonthDeals: thisMonthDealsSnapshot.size,
        totalRevenue,
      });

      return {
        todayActivities: todayActivitiesSnapshot.size,
        thisWeekLeads: last7DaysLeadsSnapshot.size, // This is actually 7 days, not week
        thisMonthDeals: thisMonthDealsSnapshot.size,
        totalRevenue,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting real-time metrics:", error);
      // Return default values on error
      return {
        todayActivities: 0,
        thisWeekLeads: 0,
        thisMonthDeals: 0,
        totalRevenue: 0,
        lastUpdated: new Date().toISOString(),
      };
      throw error;
    }
  }

  async getSalesPerformance(startDate: Date, endDate: Date) {
    try {
      const dealsQuery = query(
        collection(db, "deals"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate))
      );

      const dealsSnapshot = await getDocs(dealsQuery);
      const deals = dealsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreDeal[];

      // Calculate metrics
      const totalDeals = deals.length;
      const closedWonDeals = deals.filter(
        (deal) => deal.stage === "CLOSED_WON"
      );
      const closedLostDeals = deals.filter(
        (deal) => deal.stage === "CLOSED_LOST"
      );
      const totalRevenue = closedWonDeals.reduce(
        (sum, deal) => sum + deal.value,
        0
      );
      const averageDealSize =
        closedWonDeals.length > 0 ? totalRevenue / closedWonDeals.length : 0;
      const conversionRate =
        totalDeals > 0 ? (closedWonDeals.length / totalDeals) * 100 : 0;

      // Group by month for chart data
      const monthlyData = deals.reduce(
        (acc: Record<string, MonthlyData>, deal) => {
          const month = new Date(deal.createdAt.toDate())
            .toISOString()
            .substring(0, 7);
          if (!acc[month]) {
            acc[month] = { month, deals: 0, revenue: 0, closed: 0 };
          }
          acc[month].deals++;
          if (deal.stage === "CLOSED_WON") {
            acc[month].revenue += deal.value;
            acc[month].closed++;
          }
          return acc;
        },
        {}
      );

      return {
        totalDeals,
        closedWonDeals: closedWonDeals.length,
        closedLostDeals: closedLostDeals.length,
        totalRevenue,
        averageDealSize,
        conversionRate,
        chartData: Object.values(monthlyData),
      };
    } catch (error) {
      console.error("Error getting sales performance:", error);
      throw error;
    }
  }

  async getLeadAnalytics(startDate: Date, endDate: Date) {
    try {
      const leadsQuery = query(
        collection(db, "leads"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate))
      );

      const leadsSnapshot = await getDocs(leadsQuery);
      const leads = leadsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreLead[];

      // Calculate metrics
      const totalLeads = leads.length;
      const contactedLeads = leads.filter(
        (lead) => lead.status === "CONTACTED"
      );
      const proposalLeads = leads.filter((lead) => lead.status === "PROPOSAL");
      const closedLeads = leads.filter((lead) => lead.status === "CLOSED");
      const contactRate =
        totalLeads > 0 ? (contactedLeads.length / totalLeads) * 100 : 0;
      const proposalRate =
        totalLeads > 0 ? (proposalLeads.length / totalLeads) * 100 : 0;
      const closeRate =
        totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;

      // Group by source
      const sourceData = leads.reduce((acc: Record<string, number>, lead) => {
        const source = lead.source || "Unknown";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      // Group by month for chart data
      const monthlyData = leads.reduce(
        (acc: Record<string, LeadMonthlyData>, lead) => {
          const month = new Date(lead.createdAt.toDate())
            .toISOString()
            .substring(0, 7);
          if (!acc[month]) {
            acc[month] = { month, leads: 0, qualified: 0, converted: 0 };
          }
          acc[month].leads++;
          if (lead.status === "CONTACTED" || lead.status === "PROPOSAL") {
            acc[month].qualified++;
          }
          if (lead.status === "CLOSED") {
            acc[month].converted++;
          }
          return acc;
        },
        {}
      );

      return {
        totalLeads,
        contactedLeads: contactedLeads.length,
        proposalLeads: proposalLeads.length,
        closedLeads: closedLeads.length,
        contactRate,
        proposalRate,
        closeRate,
        sourceData: Object.entries(sourceData).map(([source, count]) => ({
          source,
          count,
        })),
        chartData: Object.values(monthlyData),
      };
    } catch (error) {
      console.error("Error getting lead analytics:", error);
      throw error;
    }
  }

  async getActivityAnalytics(startDate: Date, endDate: Date) {
    try {
      const activitiesQuery = query(
        collection(db, "activities"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate))
      );

      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activities = activitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreActivity[];

      // Calculate metrics
      const totalActivities = activities.length;
      const callActivities = activities.filter(
        (activity) => activity.type === "CALL"
      );
      const emailActivities = activities.filter(
        (activity) => activity.type === "EMAIL"
      );
      const meetingActivities = activities.filter(
        (activity) => activity.type === "MEETING"
      );
      const noteActivities = activities.filter(
        (activity) => activity.type === "NOTE"
      );
      const taskActivities = activities.filter(
        (activity) => activity.type === "TASK"
      );

      // Group by type
      const typeData = activities.reduce(
        (acc: Record<string, number>, activity) => {
          const type = activity.type;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {}
      );

      // Group by month for chart data
      const monthlyData = activities.reduce(
        (acc: Record<string, ActivityMonthlyData>, activity) => {
          const month = new Date(activity.createdAt.toDate())
            .toISOString()
            .substring(0, 7);
          if (!acc[month]) {
            acc[month] = {
              month,
              activities: 0,
              calls: 0,
              emails: 0,
              meetings: 0,
            };
          }
          acc[month].activities++;
          if (activity.type === "CALL") {
            acc[month].calls++;
          }
          if (activity.type === "EMAIL") {
            acc[month].emails++;
          }
          if (activity.type === "MEETING") {
            acc[month].meetings++;
          }
          return acc;
        },
        {}
      );

      return {
        totalActivities,
        callActivities: callActivities.length,
        emailActivities: emailActivities.length,
        meetingActivities: meetingActivities.length,
        noteActivities: noteActivities.length,
        taskActivities: taskActivities.length,
        typeData: Object.entries(typeData).map(([type, count]) => ({
          type,
          count,
        })),
        chartData: Object.values(monthlyData),
      };
    } catch (error) {
      console.error("Error getting activity analytics:", error);
      throw error;
    }
  }

  // Get recent leads for dashboard
  async getRecentLeads(limit: number = 5) {
    try {
      const leadsRef = collection(db, "leads");
      const q = query(leadsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const leads = snapshot.docs.slice(0, limit).map((doc) => {
        const data = doc.data() as FirestoreLead;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          status: data.status,
          source: data.source,
          assignedTo: data.assignedTo,
          tags: data.tags,
          notes: data.notes,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt?.toDate() || data.createdAt.toDate(),
        };
      });

      return leads;
    } catch (error) {
      console.error("Error getting recent leads:", error);
      throw error;
    }
  }

  // Get recent activities for dashboard
  async getRecentActivities(limit: number = 5) {
    try {
      const activitiesRef = collection(db, "activities");
      const q = query(activitiesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const activities = await Promise.all(
        snapshot.docs.slice(0, limit).map(async (docSnapshot) => {
          const data = docSnapshot.data() as FirestoreActivity;

          // Get related lead or deal information
          let relatedInfo = null;
          if (data.leadId) {
            try {
              const leadDoc = await getDoc(doc(db, "leads", data.leadId));
              if (leadDoc.exists()) {
                const leadData = leadDoc.data() as FirestoreLead;
                relatedInfo = {
                  type: "Lead",
                  name: leadData.name,
                  company: leadData.company,
                  status: leadData.status,
                  email: leadData.email,
                };
              }
            } catch (error) {
              console.log("Could not fetch lead data:", error);
            }
          } else if (data.dealId) {
            try {
              const dealDoc = await getDoc(doc(db, "deals", data.dealId));
              if (dealDoc.exists()) {
                const dealData = dealDoc.data() as FirestoreDeal;
                relatedInfo = {
                  type: "Deal",
                  name: dealData.title,
                  value: dealData.value,
                  stage: dealData.stage,
                };
              }
            } catch (error) {
              console.log("Could not fetch deal data:", error);
            }
          }

          return {
            id: docSnapshot.id,
            type: data.type,
            description: data.description,
            leadId: data.leadId,
            dealId: data.dealId,
            userId: data.userId,
            metadata: data.metadata,
            relatedInfo,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate() || data.createdAt.toDate(),
          };
        })
      );

      return activities;
    } catch (error) {
      console.error("Error getting recent activities:", error);
      throw error;
    }
  }

  // Additional analytics methods for dashboard
  async getDailyLeads() {
    try {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      const dailyData = await Promise.all(
        last7Days.map(async (date) => {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          const leadsQuery = query(
            collection(db, "leads"),
            where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
            where("createdAt", "<=", Timestamp.fromDate(endOfDay))
          );

          const snapshot = await getDocs(leadsQuery);
          return {
            date: date.toISOString().split("T")[0],
            count: snapshot.size,
          };
        })
      );

      return dailyData;
    } catch (error) {
      console.error("Error getting daily leads:", error);
      return [];
    }
  }

  async getMonthlyDeals() {
    try {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const monthlyData = await Promise.all(
        last6Months.map(async (date) => {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          );

          const dealsQuery = query(
            collection(db, "deals"),
            where("stage", "==", "CLOSED_WON"),
            where("createdAt", ">=", Timestamp.fromDate(startOfMonth)),
            where("createdAt", "<=", Timestamp.fromDate(endOfMonth))
          );

          const snapshot = await getDocs(dealsQuery);
          return {
            month: date.toISOString().substring(0, 7),
            count: snapshot.size,
          };
        })
      );

      return monthlyData;
    } catch (error) {
      console.error("Error getting monthly deals:", error);
      return [];
    }
  }

  async getMonthlyLeads() {
    try {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const monthlyData = await Promise.all(
        last6Months.map(async (date) => {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          );

          const leadsQuery = query(
            collection(db, "leads"),
            where("createdAt", ">=", Timestamp.fromDate(startOfMonth)),
            where("createdAt", "<=", Timestamp.fromDate(endOfMonth))
          );

          const snapshot = await getDocs(leadsQuery);
          return {
            month: date.toISOString().substring(0, 7),
            count: snapshot.size,
          };
        })
      );

      return monthlyData;
    } catch (error) {
      console.error("Error getting monthly leads:", error);
      return [];
    }
  }

  async getLeadStatusDistribution() {
    try {
      const leadsSnapshot = await getDocs(collection(db, "leads"));
      const statusCounts: Record<string, number> = {};

      leadsSnapshot.docs.forEach((doc) => {
        const lead = doc.data() as FirestoreLead;
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: (count / leadsSnapshot.size) * 100,
      }));
    } catch (error) {
      console.error("Error getting lead status distribution:", error);
      return [];
    }
  }

  async getConversionFunnel() {
    try {
      const [leadsSnapshot, dealsSnapshot] = await Promise.all([
        getDocs(collection(db, "leads")),
        getDocs(collection(db, "deals")),
      ]);

      const totalLeads = leadsSnapshot.size;
      const totalDeals = dealsSnapshot.size;

      const leadsContacted = leadsSnapshot.docs.filter(
        (doc) => (doc.data() as FirestoreLead).status === "CONTACTED"
      ).length;

      const leadsProposal = leadsSnapshot.docs.filter(
        (doc) => (doc.data() as FirestoreLead).status === "PROPOSAL"
      ).length;

      const dealsClosed = dealsSnapshot.docs.filter(
        (doc) => (doc.data() as FirestoreDeal).stage === "CLOSED_WON"
      ).length;

      return [
        { stage: "Leads", count: totalLeads, rate: 100 },
        {
          stage: "Contacted",
          count: leadsContacted,
          rate: totalLeads > 0 ? (leadsContacted / totalLeads) * 100 : 0,
        },
        {
          stage: "Proposal",
          count: leadsProposal,
          rate: totalLeads > 0 ? (leadsProposal / totalLeads) * 100 : 0,
        },
        {
          stage: "Deals",
          count: totalDeals,
          rate: totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0,
        },
        {
          stage: "Closed",
          count: dealsClosed,
          rate: totalLeads > 0 ? (dealsClosed / totalLeads) * 100 : 0,
        },
      ];
    } catch (error) {
      console.error("Error getting conversion funnel:", error);
      return [];
    }
  }

  async getReports(): Promise<ClientReport[]> {
    return this.getAll();
  }

  async getLeadsReport(): Promise<ClientReport[]> {
    return this.getByType("LEAD_CONVERSION");
  }

  async getDealsReport(): Promise<ClientReport[]> {
    return this.getByType("SALES_PERFORMANCE");
  }

  async getActivitiesReport(): Promise<ClientReport[]> {
    return this.getByType("ACTIVITY_SUMMARY");
  }

  async getRevenueReport(): Promise<ClientReport[]> {
    return this.getByType("SALES_PERFORMANCE");
  }

  async exportReport(type: string): Promise<void> {
    // Mock implementation for export
    console.log("Exporting report:", type);
  }
}

export const reportsService = new ReportsService();
