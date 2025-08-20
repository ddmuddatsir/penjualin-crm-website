import { useState } from "react";
import { useDeals } from "@/hooks/useDeals";
import { useLeads } from "@/hooks/useLeads";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Timestamp } from "firebase/firestore";
import type { ClientDeal, FirestoreDeal } from "@/types/firebase";

export function useDealsPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [editDeal, setEditDeal] = useState<ClientDeal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientDeal>>({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    dealId: "",
    dealName: "",
  });

  const { handleErrorWithToast } = useErrorHandler();

  // Use Firebase deals hook
  const {
    deals: data = [],
    isLoading,
    isError,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
    refetchDeals,
  } = useDeals();

  const { leads = [] } = useLeads();

  // Filter data based on search and stage
  const filteredDeals = data.filter((deal) => {
    const matchesSearch =
      !search ||
      deal.title?.toLowerCase().includes(search.toLowerCase()) ||
      deal.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStage = stage === "all" || deal.stage === stage;

    return matchesSearch && matchesStage;
  });

  // Handlers
  const handleEdit = (deal: ClientDeal) => {
    setEditDeal(deal);
    setFormData(deal);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditDeal(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (dealId: string) => {
    // Find deal to get title for confirmation dialog
    const deal = data.find((d) => d.id === dealId);
    setDeleteDialog({
      open: true,
      dealId,
      dealName: deal?.title || "Deal",
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteDeal(deleteDialog.dealId);
      setDeleteDialog({ open: false, dealId: "", dealName: "" });
    } catch (error) {
      handleErrorWithToast(error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data for submission with proper validation
      const defaultCloseDate = new Date();
      defaultCloseDate.setDate(defaultCloseDate.getDate() + 30); // 30 days from now

      const submitData = {
        title: formData.title || "",
        description: formData.description || "",
        value: Number(formData.value) || 0,
        stage:
          (formData.stage as
            | "PROSPECTING"
            | "QUALIFICATION"
            | "PROPOSAL"
            | "NEGOTIATION"
            | "CLOSED_WON"
            | "CLOSED_LOST") || "QUALIFICATION",
        leadId: formData.leadId || "",
        assignedTo: "user123", // Default assigned user
        probability: formData.probability || 50,
        tags: formData.tags || [],
        expectedCloseDate: formData.expectedCloseDate
          ? formData.expectedCloseDate instanceof Date
            ? Timestamp.fromDate(formData.expectedCloseDate)
            : formData.expectedCloseDate
          : Timestamp.fromDate(defaultCloseDate),
      };

      // Validate required fields
      if (!submitData.title) {
        throw new Error("Title is required");
      }
      if (!submitData.value || submitData.value <= 0) {
        throw new Error("Value must be greater than 0");
      }
      if (!submitData.stage) {
        throw new Error("Stage is required");
      }

      if (editDeal) {
        await updateDeal(editDeal.id, submitData);
      } else {
        await createDeal(submitData);
      }

      setIsFormOpen(false);
      setEditDeal(null);
      setFormData({});
    } catch (error) {
      console.error("Error submitting deal:", error);
      handleErrorWithToast(error);
    }
  };

  return {
    // State
    search,
    setSearch,
    stage,
    setStage,
    deleteDialog,
    setDeleteDialog,
    editDeal,
    isFormOpen,
    setIsFormOpen,
    formData,

    // Data
    data,
    isLoading,
    isError,
    error,
    filteredDeals,
    leads,

    // Handlers
    handleEdit,
    handleAdd,
    handleDelete,
    confirmDelete,
    handleFormSubmit,
    handleFormChange,
    refetchDeals,
  };
}
