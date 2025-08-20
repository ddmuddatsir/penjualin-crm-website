// app/api/firebase/activities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services/firebase";
import { FirestoreActivity } from "@/types/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const leadId = searchParams.get("leadId");
    const dealId = searchParams.get("dealId");
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") as FirestoreActivity["type"] | null;
    const pageSize = parseInt(searchParams.get("limit") || "20");
    const lastDocId = searchParams.get("lastDocId");

    // If specific filters are provided, use filtered search
    if (leadId || dealId || userId || type) {
      const filters = {
        ...(leadId && { leadId }),
        ...(dealId && { dealId }),
        ...(userId && { userId }),
        ...(type && { type }),
      };

      const activities = await activityService.getWithFilters(filters);

      return NextResponse.json({
        data: activities,
        hasMore: false, // For filtered results, we return all data
        total: activities.length,
      });
    }

    // Default: get paginated results using cursor-based pagination
    let lastDoc;
    if (lastDocId) {
      // If we have a lastDocId, we would need to fetch that document
      // For simplicity, we'll skip this for now and just use pageSize
      lastDoc = undefined;
    }

    const result = await activityService.getPaginated(pageSize, lastDoc);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { type, description, userId } = body;
    if (!type || !description || !userId) {
      return NextResponse.json(
        { error: "Type, description, and userId are required" },
        { status: 400 }
      );
    }

    // Validate that either leadId or dealId is provided
    if (!body.leadId && !body.dealId) {
      return NextResponse.json(
        { error: "Either leadId or dealId must be provided" },
        { status: 400 }
      );
    }

    // Create activity data
    const activityData: Omit<
      FirestoreActivity,
      "id" | "createdAt" | "updatedAt"
    > = {
      type,
      description,
      userId,
      leadId: body.leadId || undefined,
      dealId: body.dealId || undefined,
      metadata: body.metadata || {},
    };

    const newActivity = await activityService.createActivity(activityData);
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
