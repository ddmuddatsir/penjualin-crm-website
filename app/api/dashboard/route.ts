import { NextResponse } from "next/server";
import { reportsService } from "@/services/firebase";

export async function GET() {
  try {
    // Get dashboard data from Firebase using reports service
    const dashboardData = await reportsService.getDashboardData();

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
