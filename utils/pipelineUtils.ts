// Utility functions for pipeline operations
import { LEAD_STATUS, LEAD_STATUS_OPTIONS } from "@/constants/lead";
import type { ClientLead } from "@/types/firebase";

const VALID_STATUSES = Object.values(LEAD_STATUS);

export const validateLeadStatus = (status: string): string => {
  const validStatus = VALID_STATUSES.find((s) => s === status);
  if (!validStatus) {
    console.warn(
      `❌ Invalid lead status found: "${status}", defaulting to OPEN`
    );
    return LEAD_STATUS.OPEN;
  }
  return validStatus as string;
};

export const filterLeads = (
  leads: ClientLead[],
  filters: {
    q: string;
    status: string;
    owner: string;
    date: string;
  }
): ClientLead[] => {
  return leads.filter((lead) => {
    // Search filter
    if (filters.q && filters.q.trim()) {
      const searchTerm = filters.q.toLowerCase();
      const matchesSearch = [lead.name, lead.company, lead.email].some(
        (field) => field.toLowerCase().includes(searchTerm)
      );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (
      filters.status &&
      filters.status !== "all" &&
      lead.status !== filters.status
    ) {
      return false;
    }

    // Owner filter
    if (
      filters.owner &&
      filters.owner !== "all" &&
      lead.assignedTo !== filters.owner
    ) {
      return false;
    }

    // Date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      const leadDate = new Date(lead.createdAt);
      if (leadDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }

    return true;
  });
};

export const groupLeadsByStatus = (
  leads: ClientLead[]
): Record<string, ClientLead[]> => {
  const grouped: Record<string, ClientLead[]> = {};

  // Initialize empty arrays for all statuses
  LEAD_STATUS_OPTIONS.forEach((status) => {
    grouped[status] = [];
  });

  // Group leads by status
  leads.forEach((lead) => {
    const validStatus = validateLeadStatus(lead.status);
    if (!grouped[validStatus]) {
      grouped[validStatus] = [];
    }
    grouped[validStatus].push({
      ...lead,
      status: validStatus as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED",
    });
  });

  return grouped;
};
