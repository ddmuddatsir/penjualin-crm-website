"use client";

import { Button } from "@/components/ui/button";
import ActivityCalendar from "./ActivityCalendar";
import { PageLayout } from "@/components/layouts";
import { useActivitiesPage } from "@/hooks/useActivitiesPage";
import { ConfirmationDialog } from "@/components/ui";

// Import components
import ActivityFilters from "./components/ActivityFilters";
import ActivityTable from "./components/ActivityTable";
import AddActivityDialog from "./components/AddActivityDialog";
import ActivityDetailDialog from "./components/ActivityDetailDialog";
import ActivitySyncButton from "./components/ActivitySyncButton";

export default function ActivitiesPage() {
  const {
    // State
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    selectedDate,
    deleteDialog,
    setDeleteDialog,
    isFormOpen,
    setIsFormOpen,
    detailActivity,
    setDetailActivity,

    // Data
    data,
    isLoading,
    filteredActivities,
    users,
    leads,
    formData,

    // Handlers
    handleAdd,
    handleAddActivity,
    handleEventClick,
    confirmDelete,
    handleFormSubmit,
    handleFormChange,
  } = useActivitiesPage();

  return (
    <PageLayout
      title="Activities"
      subtitle="Kelola semua aktivitas Anda"
      description="Jadwalkan dan pantau aktivitas bisnis Anda"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Activities" },
      ]}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Calendar and Filters */}
        <div className="md:w-1/3 w-full flex flex-col gap-4">
          <ActivityFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            search={search}
            setSearch={setSearch}
          />

          <ActivityCalendar
            activities={data}
            onAdd={handleAddActivity}
            onEventClick={handleEventClick}
            filterType={filterType}
            filterStatus={filterStatus}
          />

          <Button className="w-full" onClick={handleAdd}>
            Tambah Aktivitas
          </Button>
        </div>

        {/* Right Side - Activity Table */}
        <div className="flex-1">
          <ActivityTable
            activities={
              filteredActivities?.map((a) => ({
                ...a,
                title: a.description || "",
                date:
                  a.createdAt instanceof Date
                    ? a.createdAt.toISOString()
                    : new Date(a.createdAt).toISOString(),
                type: a.type as
                  | "MEETING"
                  | "CALL"
                  | "DEMO"
                  | "EMAIL"
                  | "TASK"
                  | "NOTE",
                leadId: a.leadId || "",
              })) || []
            }
            isLoading={isLoading}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Add/Edit Activity Dialog */}
      <AddActivityDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={{
          type: formData.type as
            | "MEETING"
            | "CALL"
            | "DEMO"
            | "EMAIL"
            | "TASK"
            | "NOTE",
          title: formData.description || "",
          leadId: formData.leadId || "",
          userId: formData.userId || "",
          notes: formData.description || "",
        }}
        setForm={(form) => {
          handleFormChange("type", form.type);
          handleFormChange("description", form.title);
          handleFormChange("leadId", form.leadId);
          handleFormChange("userId", form.userId);
        }}
        leads={
          leads?.map((l) => ({
            ...l,
            assignedTo: l.assignedTo
              ? { id: l.assignedTo, name: l.assignedTo, email: "" }
              : null,
          })) || []
        }
        users={users}
        selectedDate={selectedDate}
        onSubmit={handleFormSubmit}
        isPending={isLoading}
      />

      {/* Activity Detail Dialog */}
      <ActivityDetailDialog
        activity={
          detailActivity
            ? {
                ...detailActivity,
                title: detailActivity.description || "",
                date:
                  detailActivity.createdAt instanceof Date
                    ? detailActivity.createdAt.toISOString()
                    : new Date(detailActivity.createdAt).toISOString(),
                type: detailActivity.type as
                  | "MEETING"
                  | "CALL"
                  | "DEMO"
                  | "EMAIL"
                  | "TASK"
                  | "NOTE",
                leadId: detailActivity.leadId || "",
              }
            : null
        }
        onOpenChange={() => setDetailActivity(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open &&
          setDeleteDialog({ open: false, activityId: "", activityName: "" })
        }
        title="Hapus Aktivitas"
        description={`Apakah Anda yakin ingin menghapus aktivitas "${deleteDialog.activityName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isLoading}
      />

      {/* Sync Button */}
      <div className="mt-6">
        <ActivitySyncButton />
      </div>
    </PageLayout>
  );
}
