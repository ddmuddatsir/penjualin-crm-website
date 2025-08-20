import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useLeads } from "@/hooks/useLeads";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { ClientLead } from "@/types/firebase";

export function useLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editLead, setEditLead] = useState<ClientLead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientLead>>({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    leadId: "",
    leadName: "",
  });

  const { handleErrorWithToast } = useErrorHandler();

  // Use Firebase leads hook
  const {
    leads: data = [],
    isLoading,
    isError,
    error,
    createLead,
    updateLead,
    deleteLead,
    refetchLeads,
  } = useLeads();

  const { users = [] } = useUsers();

  // Filter data based on search and status
  const filteredLeads = data.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "all" || lead.status === status;

    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleEdit = (lead: ClientLead) => {
    setEditLead(lead);
    setFormData(lead);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditLead(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (leadId: string) => {
    // Find lead to get name for confirmation dialog
    const lead = data.find((l) => l.id === leadId);
    setDeleteDialog({
      open: true,
      leadId,
      leadName: lead?.name || "Lead",
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteLead(deleteDialog.leadId);
      setDeleteDialog({ open: false, leadId: "", leadName: "" });
    } catch (error) {
      handleErrorWithToast(error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data for Firebase
      const submitData = {
        name: formData.name || "",
        email: formData.email || "",
        company: formData.company || "",
        phone: formData.phone || "",
        status:
          (formData.status as "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED") ||
          "OPEN",
        source: formData.source || "WEBSITE",
        assignedTo: formData.assignedTo || "",
        notes: formData.notes || "",
        tags: formData.tags || [],
      };

      if (editLead) {
        await updateLead(editLead.id, submitData);
      } else {
        await createLead(submitData);
      }

      setIsFormOpen(false);
      setEditLead(null);
      setFormData({});
    } catch (error) {
      console.error("Error submitting lead:", error);
      handleErrorWithToast(error);
    }
  };

  return {
    // State
    search,
    setSearch,
    status,
    setStatus,
    deleteDialog,
    setDeleteDialog,
    editLead,
    isFormOpen,
    setIsFormOpen,
    formData,

    // Data
    data,
    isLoading,
    isError,
    error,
    filteredLeads,
    users,

    // Handlers
    handleEdit,
    handleAdd,
    handleDelete,
    confirmDelete,
    handleFormSubmit,
    handleFormChange,
    refetchLeads,
  };
}
