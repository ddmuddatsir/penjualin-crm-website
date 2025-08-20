import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useLeads } from "@/hooks/useLeads";
import { useActivities } from "@/hooks/useActivities";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { ClientActivity } from "@/types/firebase";

export function useActivitiesPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editActivity, setEditActivity] = useState<ClientActivity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailActivity, setDetailActivity] = useState<ClientActivity | null>(
    null
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    activityId: "",
    activityName: "",
  });

  const { handleErrorWithToast } = useErrorHandler();

  // Use Firebase activities hook
  const {
    activities: data = [],
    isLoading,
    isError,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetchActivities,
  } = useActivities();

  const { users = [] } = useUsers();
  const { leads = [] } = useLeads();

  // Filter data based on search, type, and status
  const filteredActivities = data.filter((activity) => {
    const matchesSearch =
      !search ||
      activity.description?.toLowerCase().includes(search.toLowerCase()) ||
      activity.type?.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "all" || activity.type === filterType;

    return matchesSearch && matchesType;
  });

  // Handlers
  const handleEdit = (activity: ClientActivity) => {
    setEditActivity(activity);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditActivity(null);
    setIsFormOpen(true);
  };

  const handleAddActivity = (date: string) => {
    setSelectedDate(new Date(date));
    setEditActivity(null);
    setIsFormOpen(true);
  };

  const handleEventClick = (activity: ClientActivity) => {
    setDetailActivity(activity);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteDialog({
      open: true,
      activityId: id,
      activityName: name,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteActivity(deleteDialog.activityId);
      setDeleteDialog({ open: false, activityId: "", activityName: "" });
    } catch (error) {
      handleErrorWithToast(error);
    }
  };

  const handleFormSubmit = async (formData: {
    type: string;
    title: string;
    leadId: string;
    userId: string;
    notes: string;
    date: string;
  }) => {
    try {
      // Map form data to ClientActivity format
      const activityData: Omit<
        ClientActivity,
        "id" | "createdAt" | "updatedAt"
      > = {
        type: formData.type as ClientActivity["type"],
        description:
          formData.title + (formData.notes ? ` - ${formData.notes}` : ""),
        leadId: formData.leadId !== "none" ? formData.leadId : undefined,
        dealId: undefined,
        userId: formData.userId !== "none" ? formData.userId : "admin",
        metadata: {},
      };

      if (editActivity) {
        await updateActivity(editActivity.id, activityData);
      } else {
        await createActivity(activityData);
      }
      setIsFormOpen(false);
      setEditActivity(null);
    } catch (error) {
      handleErrorWithToast(error);
    }
  };

  const handleFormChange = (key: string, value: unknown) => {
    // For now, this is a placeholder since we're not managing form state here
    // The form components will manage their own state
    console.log(`Form change: ${key} = ${value}`);
  };

  const formData = editActivity
    ? {
        type: editActivity.type || "MEETING",
        description: editActivity.description || "",
        leadId: editActivity.leadId || "none",
        userId: editActivity.userId || "none",
        date: selectedDate.toISOString().slice(0, 10),
      }
    : {
        type: "MEETING",
        description: "",
        leadId: "none",
        userId: "none",
        date: selectedDate.toISOString().slice(0, 10),
      };

  return {
    // State
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    selectedDate,
    setSelectedDate,
    deleteDialog,
    setDeleteDialog,
    editActivity,
    isFormOpen,
    setIsFormOpen,
    detailActivity,
    setDetailActivity,

    // Data
    data,
    isLoading,
    isError,
    error,
    filteredActivities,
    users,
    leads,
    formData,

    // Handlers
    handleEdit,
    handleAdd,
    handleAddActivity,
    handleEventClick,
    handleDelete,
    confirmDelete,
    handleFormSubmit,
    handleFormChange,
    refetchActivities,
  };
}
