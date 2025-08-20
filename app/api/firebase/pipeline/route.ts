// app/api/firebase/pipeline/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dealService, leadService } from "@/services/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "deals"; // 'deals' or 'leads'

    if (type === "leads") {
      // Get leads pipeline data
      const leadMetrics = await leadService.getDashboardMetrics();
      const conversionFunnel = await leadService.getConversionFunnel();

      const leadsPipeline = {
        stages: [
          {
            id: "OPEN",
            title: "Open",
            leads: leadMetrics.byStatus.OPEN,
            items: await leadService.getByStatus("OPEN"),
          },
          {
            id: "CONTACTED",
            title: "Contacted",
            leads: leadMetrics.byStatus.CONTACTED,
            items: await leadService.getByStatus("CONTACTED"),
          },
          {
            id: "PROPOSAL",
            title: "Proposal",
            leads: leadMetrics.byStatus.PROPOSAL,
            items: await leadService.getByStatus("PROPOSAL"),
          },
          {
            id: "CLOSED",
            title: "Closed",
            leads: leadMetrics.byStatus.CLOSED,
            items: await leadService.getByStatus("CLOSED"),
          },
        ],
        metrics: {
          total: leadMetrics.total,
          conversionFunnel,
        },
      };

      return NextResponse.json(leadsPipeline);
    }

    // Default: deals pipeline
    const pipelineData = await dealService.getPipelineData();
    const conversionRates = await dealService.getConversionRates();
    const forecast = await dealService.getForecast();

    const dealsPipeline = {
      stages: pipelineData.stages.map((stage) => ({
        id: stage.stage,
        title: stage.stage
          .replace("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        deals: stage.count,
        value: stage.totalValue,
        items: stage.deals,
      })),
      metrics: {
        totalDeals: pipelineData.totalDeals,
        totalValue: pipelineData.totalValue,
        conversionRates,
        forecast,
      },
    };

    return NextResponse.json(dealsPipeline);
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipeline data" },
      { status: 500 }
    );
  }
}
