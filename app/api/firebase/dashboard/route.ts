// app/api/firebase/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { leadService, dealService, activityService } from "@/services/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Get metrics from all services
    const [leadMetrics, dealMetrics, activityStats] = await Promise.all([
      leadService.getDashboardMetrics(),
      dealService.getDashboardMetrics(),
      activityService.getStatistics(userId || undefined),
    ]);

    // Get recent data
    const [recentActivities, pipelineData, conversionFunnel] =
      await Promise.all([
        activityService.getActivityFeed(10),
        dealService.getPipelineData(),
        leadService.getConversionFunnel(),
      ]);

    // Compile dashboard data
    const dashboardData = {
      overview: {
        totalLeads: leadMetrics.total,
        totalDeals: dealMetrics.total,
        totalDealValue: dealMetrics.totalValue,
        totalActivities: activityStats.total,
        avgDealValue: dealMetrics.avgDealValue,
        conversionRate:
          leadMetrics.total > 0
            ? (leadMetrics.byStatus.CLOSED / leadMetrics.total) * 100
            : 0,
      },
      leads: {
        total: leadMetrics.total,
        byStatus: leadMetrics.byStatus,
        bySource: leadMetrics.bySource,
        recent: leadMetrics.recentLeads,
        conversionFunnel,
      },
      deals: {
        total: dealMetrics.total,
        totalValue: dealMetrics.totalValue,
        byStage: dealMetrics.byStage,
        wonDeals: dealMetrics.wonDeals,
        lostDeals: dealMetrics.lostDeals,
        avgValue: dealMetrics.avgDealValue,
        recent: dealMetrics.recentDeals,
        pipeline: pipelineData,
      },
      activities: {
        total: activityStats.total,
        byType: activityStats.byType,
        today: activityStats.today,
        thisWeek: activityStats.thisWeek,
        thisMonth: activityStats.thisMonth,
        recent: recentActivities,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
