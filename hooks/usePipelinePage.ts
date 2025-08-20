import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DragEndEvent } from "@dnd-kit/core";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_LABELS } from "@/constants/lead";
import { useLeads } from "@/hooks/useLeads";
import { activityService } from "@/services";
import type { ClientLead } from "@/types/firebase";

const STATUSES = LEAD_STATUS_OPTIONS;
const STATUS_LABELS = LEAD_STATUS_LABELS;

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
  } = useLeads();

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

  // Apply filters to leads
  const leads = useMemo(() => {
    let filteredLeads = allLeads;

    if (filters.q) {
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
  }, [allLeads, filters]);

  // Group leads by status
  const groupedColumns = useMemo(() => {
    const grouped: Record<string, ClientLead[]> = {};
    STATUSES.forEach((s) => (grouped[s] = []));
    leads.forEach((lead) => {
      grouped[lead.status]?.push(lead);
    });
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
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const editLeadMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      company?: string;
      email?: string;
      status?: string;
    }) => {
      const { id, ...updateData } = data;
      const cleanedData: Partial<Omit<ClientLead, "id" | "createdAt">> = {};
      if (updateData.name) cleanedData.name = updateData.name;
      if (updateData.company) cleanedData.company = updateData.company;
      if (updateData.email) cleanedData.email = updateData.email;
      if (updateData.status)
        cleanedData.status = updateData.status as
          | "OPEN"
          | "CONTACTED"
          | "PROPOSAL"
          | "CLOSED";

      return await updateLead(id, cleanedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const addLeadMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      company: string;
      email: string;
      status: string | null;
    }) => {
      const leadData: Omit<ClientLead, "id" | "createdAt" | "updatedAt"> = {
        name: data.name,
        company: data.company,
        email: data.email,
        status: (data.status || "OPEN") as
          | "OPEN"
          | "CONTACTED"
          | "PROPOSAL"
          | "CLOSED",
        phone: "",
        source: "MANUAL",
        value: 0,
        notes: "",
        assignedTo: "admin",
      };
      return await createLead(leadData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setAddStatus(null);
      setNewLead({ name: "", company: "", email: "" });
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      title: string;
      notes: string;
      date: string;
      leadId: string;
      userId?: string;
    }) => {
      const activityData = {
        type: data.type as
          | "CALL"
          | "EMAIL"
          | "MEETING"
          | "NOTE"
          | "TASK"
          | "OTHER",
        description: data.title + (data.notes ? ` - ${data.notes}` : ""),
        leadId: data.leadId,
        userId: data.userId || "admin",
      };
      return await activityService.create(activityData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setShowAddActivity(false);
      setNewActivity({
        type: "",
        title: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    },
  });

  // Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;
    const lead = leads.find((l) => l.id === leadId);

    if (lead && lead.status !== newStatus) {
      updateLeadMutation.mutate({ id: leadId, status: newStatus });
    }
  };

  const handleAddLead = (status: string) => {
    setAddStatus(status);
  };

  const handleCloseAddDialog = () => {
    setAddStatus(null);
    setNewLead({ name: "", company: "", email: "" });
  };

  const handleSubmitNewLead = () => {
    addLeadMutation.mutate({ ...newLead, status: addStatus });
  };

  const handleCloseLeadDetail = () => {
    setActiveLead(null);
  };

  const handleEditLead = () => {
    if (activeLead) {
      setEditLead(activeLead);
      setActiveLead(null); // Close detail modal to show edit modal
    }
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
      newActivity.title &&
      newActivity.notes
    ) {
      addActivityMutation.mutate({
        type: newActivity.type,
        title: newActivity.title,
        notes: newActivity.notes,
        date: newActivity.date,
        leadId: activeLead.id,
        // TODO: Get actual user ID from session
        userId: "user-id-placeholder",
      });
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
