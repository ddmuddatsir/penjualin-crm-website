// app/api/firebase/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { leadService } from "@/services/firebase";
import { FirestoreLead } from "@/types/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status") as FirestoreLead["status"] | null;
    const source = searchParams.get("source") as FirestoreLead["source"] | null;
    const assignedTo = searchParams.get("assignedTo");
    const search = searchParams.get("search");
    const pageSize = parseInt(searchParams.get("limit") || "20");
    const lastDocId = searchParams.get("lastDocId");

    // If specific filters are provided, use filtered search
    if (status || source || assignedTo || search) {
      const filters = {
        ...(status && { status }),
        ...(source && { source }),
        ...(assignedTo && { assignedTo }),
        ...(search && { search }),
      };

      const leads = await leadService.getWithFilters(filters);

      return NextResponse.json({
        data: leads,
        hasMore: false, // For filtered results, we return all data
        total: leads.length,
      });
    }

    // Default: get paginated results using cursor-based pagination
    let lastDoc;
    if (lastDocId) {
      // If we have a lastDocId, we would need to fetch that document
      // For simplicity, we'll skip this for now and just use pageSize
      lastDoc = undefined;
    }

    const result = await leadService.getPaginated(pageSize, lastDoc);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, company } = body;
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    // Create lead data
    const leadData: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt"> = {
      name,
      email,
      company,
      phone: body.phone || "",
      status: body.status || "OPEN",
      source: body.source || "MANUAL",
      assignedTo: body.assignedTo || undefined,
      value: body.value || 0,
      notes: body.notes || "",
      tags: body.tags || [],
      customFields: body.customFields || {},
    };

    const newLeadId = await leadService.create(leadData);
    const newLead = await leadService.getById(newLeadId);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
