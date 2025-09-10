import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DragEndEvent } from "@dnd-kit/core";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS,
} from "@/constants/lead";
import { useLeads } from "@/hooks/useLeads";
import { activityService } from "@/services";
import type { ClientLead, FirestoreLead } from "@/types/firebase";

const STATUSES = LEAD_STATUS_OPTIONS;
const STATUS_LABELS = LEAD_STATUS_LABELS;
const VALID_STATUSES = Object.values(LEAD_STATUS);

// Function to validate and sanitize lead status
const validateLeadStatus = (status: string): string => {
  const validStatus = VALID_STATUSES.find((s) => s === status);
  if (!validStatus) {
    console.warn(
      `❌ Invalid lead status found: "${status}", defaulting to OPEN`
    );
    return LEAD_STATUS.OPEN;
  }
  return validStatus as string;
};

type LeadFilters = {
  q: string;
  status: string;
  owner: string;
  date: string;
};

export function usePipelinePage() {
  const queryClient = useQueryClient();

  // Use Firebase leads hook
  const {
    leads: allLeads = [],
    isLoading,
    updateLead,
    createLead,
    refetchLeads,
  } = useLeads();

  // Debug logging
  console.log("usePipelinePage - allLeads:", allLeads.length, allLeads);
  console.log("usePipelinePage - isLoading:", isLoading);

  // Force refresh Firebase data
  const refreshFirebaseData = () => {
    console.log("Force refreshing Firebase data...");
    refetchLeads();
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  // State
  const [filters, setFilters] = useState<LeadFilters>({
    q: "",
    status: "all",
    owner: "all",
    date: "",
  });
  const [activeLead, setActiveLead] = useState<ClientLead | null>(null);
  const [addStatus, setAddStatus] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ name: "", company: "", email: "" });
  const [editLead, setEditLead] = useState<ClientLead | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "",
    title: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Apply filters to leads dengan fallback dummy data
  const leads: ClientLead[] = useMemo(() => {
    if (allLeads && allLeads.length > 0) {
      // Validasi status dan filter
      let filteredLeads = allLeads.map((lead) => {
        const validatedStatus = validateLeadStatus(lead.status);
        return {
          ...lead,
          status: validatedStatus as
            | "OPEN"
            | "CONTACTED"
            | "PROPOSAL"
            | "CLOSED",
        };
      });

      if (filters.q && filters.q.trim()) {
        const searchTerm = filters.q.toLowerCase();
        filteredLeads = filteredLeads.filter(
          (lead) =>
            lead.name.toLowerCase().includes(searchTerm) ||
            lead.company.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status && filters.status !== "all") {
        filteredLeads = filteredLeads.filter(
          (lead) => lead.status === filters.status
        );
      }

      if (filters.owner && filters.owner !== "all") {
        filteredLeads = filteredLeads.filter(
          (lead) => lead.assignedTo === filters.owner
        );
      }

      if (filters.date) {
        const filterDate = new Date(filters.date);
        filteredLeads = filteredLeads.filter((lead) => {
          const leadDate = new Date(lead.createdAt);
          return leadDate.toDateString() === filterDate.toDateString();
        });
      }

      return filteredLeads;
    }

    // Dummy data jika tidak ada data Firebase dan tidak loading
    if (!isLoading) {
      return [
        {
          id: "dummy-1",
          name: "Test Lead 1",
          company: "Test Company 1",
          email: "test1@example.com",
          phone: "123-456-7890",
          status: "OPEN" as const,
          source: "MANUAL" as const,
          value: 1000,
          notes: "Test lead 1",
          assignedTo: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "dummy-2",
          name: "Test Lead 2",
          company: "Test Company 2",
          email: "test2@example.com",
          phone: "123-456-7891",
          status: "CONTACTED" as const,
          source: "MANUAL" as const,
          value: 2000,
          notes: "Test lead 2",
          assignedTo: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "dummy-3",
          name: "Test Lead 3",
          company: "Test Company 3",
          email: "test3@example.com",
          phone: "123-456-7892",
          status: "PROPOSAL" as const,
          source: "MANUAL" as const,
          value: 3000,
          notes: "Test lead 3",
          assignedTo: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "dummy-4",
          name: "Test Lead 4",
          company: "Test Company 4",
          email: "test4@example.com",
          phone: "123-456-7893",
          status: "CLOSED" as const,
          source: "MANUAL" as const,
          value: 4000,
          notes: "Test lead 4",
          assignedTo: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    return [];
  }, [allLeads, filters, isLoading]);

  // Group leads by status
  const groupedColumns = useMemo(() => {
    console.log("=== DEBUGGING GROUPING ===");
    console.log("Computing groupedColumns with leads:", leads.length);
    console.log("Leads to group:", leads);

    const grouped: Record<string, ClientLead[]> = {};

    // Initialize empty arrays for all statuses
    STATUSES.forEach((status) => {
      grouped[status] = [];
    });

    // Group leads berdasarkan status
    leads.forEach((lead: ClientLead) => {
      console.log(`Processing lead: ${lead.name} with status: ${lead.status}`);
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
        console.log(`✅ Added lead to ${lead.status} column`);
      } else {
        // Jika status tidak ada di STATUSES, tetap tambahkan untuk debug
        console.warn(`❌ Unknown status found: ${lead.status}`);
        grouped[lead.status] = [lead];
      }
    });

    console.log(
      "✅ Grouped result summary:",
      Object.keys(grouped).map((k) => `${k}: ${grouped[k].length}`)
    );
    console.log("✅ Detailed grouped result:", grouped);

    // Verify total count
    const totalInGroups = Object.values(grouped).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    console.log(
      `📊 Total leads in groups: ${totalInGroups}, Original leads: ${leads.length}`
    );

    return grouped;
  }, [leads]);

  // Mutations using useLeads methods
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await updateLead(id, {
        status: status as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED",
      });
    },
    onSuccess: () => {
      console.log("Lead updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update lead:", error);
    },
  });

  const addLeadMutation = useMutation({
    mutationFn: async (
      leadData: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt">
    ) => {
      return await createLead(leadData);
    },
    onSuccess: () => {
      console.log("Lead added successfully");
    },
    onError: (error) => {
      console.error("Failed to add lead:", error);
    },
  });

  const editLeadMutation = useMutation({
    mutationFn: async (leadData: { id: string; [key: string]: unknown }) => {
      const { id, ...updateData } = leadData;
      return await updateLead(id, updateData);
    },
    onSuccess: () => {
      console.log("Lead edited successfully");
    },
    onError: (error) => {
      console.error("Failed to edit lead:", error);
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: activityService.create,
    onSuccess: () => {
      console.log("Activity added successfully");
    },
    onError: (error) => {
      console.error("Failed to add activity:", error);
    },
  });

  // Drag & Drop Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const leadId = active.id as string;
    const lead = leads.find((l) => l.id === leadId);

    if (!lead) return;

    // Tentukan status tujuan
    let newStatus: string;
    const statusValues = STATUSES as readonly string[];
    if (statusValues.includes(over.id as string)) {
      newStatus = over.id as string;
    } else {
      const overLead = leads.find((l) => l.id === over.id);
      if (!overLead) return;
      newStatus = overLead.status;
    }

    // Jika status sama, tidak perlu update apa-apa
    if (lead.status === newStatus) {
      console.log("Same status, no update needed");
      return;
    }

    // Update di cache dan backend
    queryClient.setQueryData<ClientLead[]>(["leads"], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED",
            }
          : l
      );
    });

    updateLeadMutation.mutate(
      { id: leadId, status: newStatus },
      {
        onError: () => {
          queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
      }
    );
  };

  // Handlers
  const handleAddLead = (status: string) => {
    setAddStatus(status);
  };

  const handleCloseAddDialog = () => {
    setAddStatus(null);
    setNewLead({ name: "", company: "", email: "" });
  };

  const handleSubmitNewLead = () => {
    if (addStatus && newLead.name && newLead.company && newLead.email) {
      addLeadMutation.mutate({
        name: newLead.name,
        company: newLead.company,
        email: newLead.email,
        phone: "",
        status: addStatus as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED",
        source: "MANUAL",
        value: 0,
        notes: "",
        assignedTo: "admin",
      });
      handleCloseAddDialog();
    }
  };

  const handleCloseLeadDetail = () => {
    setActiveLead(null);
  };

  const handleEditLead = (lead: ClientLead) => {
    setEditLead(lead);
    setNewLead({
      name: lead.name,
      company: lead.company,
      email: lead.email,
    });
  };

  const handleAddActivity = () => {
    setShowAddActivity(true);
  };

  const handleCloseEditLead = () => {
    setEditLead(null);
    setNewLead({ name: "", company: "", email: "" });
  };

  const handleCloseAddActivity = () => {
    setShowAddActivity(false);
    setNewActivity({
      type: "",
      title: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmitEditLead = () => {
    if (editLead) {
      editLeadMutation.mutate({
        id: editLead.id,
        name: newLead.name || editLead.name,
        company: newLead.company || editLead.company,
        email: newLead.email || editLead.email,
        status: editLead.status,
      });
      handleCloseEditLead();
    }
  };

  const handleSubmitActivity = () => {
    if (
      activeLead &&
      newActivity.type &&
      (newActivity.title || newActivity.notes)
    ) {
      addActivityMutation.mutate({
        type: newActivity.type as
          | "EMAIL"
          | "OTHER"
          | "CALL"
          | "MEETING"
          | "NOTE"
          | "TASK",
        description:
          newActivity.title || newActivity.notes || "Activity created",
        leadId: activeLead.id,
        userId: "current-user", // TODO: Replace with actual user ID
      });
      handleCloseAddActivity();
    }
  };

  return {
    // Constants
    STATUSES,
    STATUS_LABELS,

    // State
    filters,
    setFilters,
    activeLead,
    setActiveLead,
    addStatus,
    newLead,
    setNewLead,
    editLead,
    setEditLead,
    showAddActivity,
    setShowAddActivity,
    newActivity,
    setNewActivity,

    // Data
    leads,
    isLoading,
    groupedColumns,
    refreshFirebaseData,

    // Mutations
    addLeadMutation,
    updateLeadMutation,
    editLeadMutation,
    addActivityMutation,

    // Handlers
    handleDragEnd,
    handleAddLead,
    handleCloseAddDialog,
    handleSubmitNewLead,
    handleCloseLeadDetail,
    handleEditLead,
    handleAddActivity,
    handleCloseEditLead,
    handleCloseAddActivity,
    handleSubmitEditLead,
    handleSubmitActivity,
  };
}
