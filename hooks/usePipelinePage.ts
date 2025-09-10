import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DragEndEvent } from "@dnd-kit/core";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_LABELS } from "@/constants/lead";
import { useLeads } from "@/hooks/useLeads";
import { activityService } from "@/services";
import { filterLeads, groupLeadsByStatus } from "@/utils/pipelineUtils";
import type { ClientLead, FirestoreLead } from "@/types/firebase";

type LeadFilters = {
  q: string;
  status: string;
  owner: string;
  date: string;
};

export function usePipelinePage() {
  const queryClient = useQueryClient();
  const {
    leads: allLeads = [],
    isLoading,
    updateLead,
    createLead,
    refetchLeads,
  } = useLeads();

  // Simplified state management
  const [filters, setFilters] = useState<LeadFilters>({
    q: "",
    status: "all",
    owner: "all",
    date: "",
  });

  const [formState, setFormState] = useState({
    activeLead: null as ClientLead | null,
    addStatus: null as string | null,
    editLead: null as ClientLead | null,
    showAddActivity: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
  });

  const [activityData, setActivityData] = useState({
    type: "",
    title: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Processed leads with simplified logic
  const leads = useMemo(() => {
    if (allLeads?.length > 0) {
      return filterLeads(allLeads, filters);
    }
    return [];
  }, [allLeads, filters]);

  // Grouped columns with simplified logic
  const groupedColumns = useMemo(() => {
    return groupLeadsByStatus(leads);
  }, [leads]);

  // Mutations - simplified with consistent error handling
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      updateLead(id, {
        status: status as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED",
      }),
    onError: (error) => console.error("Failed to update lead:", error),
  });

  const addLeadMutation = useMutation({
    mutationFn: async (
      leadData: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt">
    ) => createLead(leadData),
    onError: (error) => console.error("Failed to add lead:", error),
  });

  const editLeadMutation = useMutation({
    mutationFn: async (leadData: { id: string; [key: string]: unknown }) => {
      const { id, ...updateData } = leadData;
      return updateLead(id, updateData);
    },
    onError: (error) => console.error("Failed to edit lead:", error),
  });

  const addActivityMutation = useMutation({
    mutationFn: activityService.create,
    onError: (error) => console.error("Failed to add activity:", error),
  });

  // Simplified drag handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const leadId = active.id as string;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Determine new status
    const statusValues = LEAD_STATUS_OPTIONS as readonly string[];
    const newStatus = statusValues.includes(over.id as string)
      ? (over.id as string)
      : leads.find((l) => l.id === over.id)?.status;

    if (!newStatus || lead.status === newStatus) return;

    // Optimistic update
    queryClient.setQueryData<ClientLead[]>(
      ["leads"],
      (oldData) =>
        oldData?.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status: newStatus as
                  | "OPEN"
                  | "CONTACTED"
                  | "PROPOSAL"
                  | "CLOSED",
              }
            : l
        ) || []
    );

    updateLeadMutation.mutate(
      { id: leadId, status: newStatus },
      { onError: () => queryClient.invalidateQueries({ queryKey: ["leads"] }) }
    );
  };

  // Simplified handlers using formState
  const updateFormState = (updates: Partial<typeof formState>) =>
    setFormState((prev) => ({ ...prev, ...updates }));

  const resetForms = () => {
    setFormData({ name: "", company: "", email: "" });
    setActivityData({
      type: "",
      title: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleAddLead = (status: string) =>
    updateFormState({ addStatus: status });

  const handleCloseAddDialog = () => {
    updateFormState({ addStatus: null });
    resetForms();
  };

  const handleSubmitNewLead = () => {
    if (
      formState.addStatus &&
      formData.name &&
      formData.company &&
      formData.email
    ) {
      addLeadMutation.mutate({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: "",
        status: formState.addStatus as
          | "OPEN"
          | "CONTACTED"
          | "PROPOSAL"
          | "CLOSED",
        source: "MANUAL",
        value: 0,
        notes: "",
        assignedTo: "admin",
      });
      handleCloseAddDialog();
    }
  };

  const handleEditLead = (lead: ClientLead) => {
    updateFormState({ editLead: lead });
    setFormData({ name: lead.name, company: lead.company, email: lead.email });
  };

  const handleSubmitEditLead = () => {
    if (formState.editLead) {
      editLeadMutation.mutate({
        id: formState.editLead.id,
        name: formData.name || formState.editLead.name,
        company: formData.company || formState.editLead.company,
        email: formData.email || formState.editLead.email,
        status: formState.editLead.status,
      });
      updateFormState({ editLead: null });
      resetForms();
    }
  };

  const handleSubmitActivity = () => {
    if (
      formState.activeLead &&
      activityData.type &&
      (activityData.title || activityData.notes)
    ) {
      addActivityMutation.mutate({
        type: activityData.type as
          | "EMAIL"
          | "OTHER"
          | "CALL"
          | "MEETING"
          | "NOTE"
          | "TASK",
        description:
          activityData.title || activityData.notes || "Activity created",
        leadId: formState.activeLead.id,
        userId: "current-user",
      });
      updateFormState({ showAddActivity: false });
      resetForms();
    }
  };

  // Force refresh helper
  const refreshFirebaseData = () => {
    refetchLeads();
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  return {
    // Constants
    STATUSES: LEAD_STATUS_OPTIONS,
    STATUS_LABELS: LEAD_STATUS_LABELS,

    // State
    filters,
    setFilters,

    // Form state (simplified access)
    activeLead: formState.activeLead,
    setActiveLead: (lead: ClientLead | null) =>
      updateFormState({ activeLead: lead }),
    addStatus: formState.addStatus,
    editLead: formState.editLead,
    showAddActivity: formState.showAddActivity,

    // Form data
    newLead: formData,
    setNewLead: setFormData,
    newActivity: activityData,
    setNewActivity: setActivityData,

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

    // Simplified handlers
    handleDragEnd,
    handleAddLead,
    handleCloseAddDialog,
    handleSubmitNewLead,
    handleCloseLeadDetail: () => updateFormState({ activeLead: null }),
    handleEditLead,
    handleAddActivity: () => updateFormState({ showAddActivity: true }),
    handleCloseEditLead: () => {
      updateFormState({ editLead: null });
      resetForms();
    },
    handleCloseAddActivity: () => {
      updateFormState({ showAddActivity: false });
      resetForms();
    },
    handleSubmitEditLead,
    handleSubmitActivity,
  };
}
