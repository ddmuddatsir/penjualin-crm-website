// app/api/firebase/deals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dealService } from "@/services/firebase";
import { FirestoreDeal } from "@/types/firebase";
import { Timestamp } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const stage = searchParams.get("stage") as FirestoreDeal["stage"] | null;
    const assignedTo = searchParams.get("assignedTo");
    const leadId = searchParams.get("leadId");
    const minValue = searchParams.get("minValue")
      ? parseInt(searchParams.get("minValue")!)
      : undefined;
    const maxValue = searchParams.get("maxValue")
      ? parseInt(searchParams.get("maxValue")!)
      : undefined;
    const search = searchParams.get("search");
    const pageSize = parseInt(searchParams.get("limit") || "20");
    const lastDocId = searchParams.get("lastDocId");

    // If specific filters are provided, use filtered search
    if (
      stage ||
      assignedTo ||
      leadId ||
      minValue !== undefined ||
      maxValue !== undefined ||
      search
    ) {
      const filters = {
        ...(stage && { stage }),
        ...(assignedTo && { assignedTo }),
        ...(leadId && { leadId }),
        ...(minValue !== undefined && { minValue }),
        ...(maxValue !== undefined && { maxValue }),
        ...(search && { search }),
      };

      const deals = await dealService.getWithFilters(filters);

      return NextResponse.json({
        data: deals,
        hasMore: false, // For filtered results, we return all data
        total: deals.length,
      });
    }

    // Default: get paginated results using cursor-based pagination
    let lastDoc;
    if (lastDocId) {
      // If we have a lastDocId, we would need to fetch that document
      // For simplicity, we'll skip this for now and just use pageSize
      lastDoc = undefined;
    }

    const result = await dealService.getPaginated(pageSize, lastDoc);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, value, stage } = body;
    if (!title || value === undefined || !stage) {
      return NextResponse.json(
        { error: "Title, value, and stage are required" },
        { status: 400 }
      );
    }

    // Create deal data
    const dealData: Omit<FirestoreDeal, "id" | "createdAt" | "updatedAt"> = {
      title,
      description: body.description || "",
      value: Number(value),
      stage: stage,
      leadId: body.leadId || undefined,
      assignedTo: body.assignedTo || undefined,
      expectedCloseDate: body.expectedCloseDate
        ? Timestamp.fromDate(new Date(body.expectedCloseDate))
        : undefined,
      probability: body.probability || 0,
      tags: body.tags || [],
      customFields: body.customFields || {},
    };

    const newDealId = await dealService.create(dealData);
    const newDeal = await dealService.getById(newDealId);
    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
