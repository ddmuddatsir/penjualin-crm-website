"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLayout } from "@/components/layouts";
import { ConfirmationDialog } from "@/components/ui";
import { useLeadsPage } from "@/hooks/useLeadsPage";
import type { ClientLead } from "@/types/firebase";

// Components
import LeadFilters from "./components/LeadFilters";
import LeadTable from "./components/LeadTable";
import LeadFormDialog from "./components/LeadFormDialog";
import ErrorDisplay from "./components/ErrorDisplay";

export default function LeadsPage() {
  const {
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
  } = useLeadsPage();

  return (
    <ErrorBoundary>
      <PageLayout
        title="Leads"
        subtitle="Kelola semua leads Anda"
        description="Pantau dan kelola prospek bisnis Anda dengan mudah"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Leads" },
        ]}
      >
        <div className="space-y-6">
          {/* Filters */}
          <LeadFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onAdd={handleAdd}
          />

          {/* Error Display */}
          <ErrorDisplay
            error={isError ? error : null}
            onRetry={() => refetchLeads()}
          />

          {/* Leads Table */}
          <LeadTable
            leads={
              filteredLeads?.map((lead) => ({
                ...lead,
                assignedTo: lead.assignedTo
                  ? {
                      id: lead.assignedTo,
                      name: lead.assignedTo,
                      email: "",
                    }
                  : null,
              })) || []
            }
            isLoading={isLoading}
            onEdit={(lead) => {
              const convertedLead = {
                ...lead,
                assignedTo:
                  typeof lead.assignedTo === "object" && lead.assignedTo
                    ? lead.assignedTo.id
                    : lead.assignedTo || undefined,
              } as ClientLead;
              handleEdit(convertedLead);
            }}
            onDelete={handleDelete}
          />

          {/* Form Dialog */}
          <LeadFormDialog
            open={isFormOpen}
            onOpenChange={() => setIsFormOpen(false)}
            isEditing={!!editLead}
            formData={formData}
            users={
              users?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: "SALES_REP" as const,
                isActive: true,
                createdAt: user.createdAt || new Date(),
                updatedAt: user.updatedAt || new Date(),
                settings: {
                  timezone: "Asia/Jakarta",
                  notifications: true,
                  emailUpdates: true,
                },
              })) || []
            }
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            isSubmitting={isLoading}
          />

          {/* Delete Confirmation Dialog */}
          <ConfirmationDialog
            open={deleteDialog.open}
            onOpenChange={(open) =>
              !open &&
              setDeleteDialog({ open: false, leadId: "", leadName: "" })
            }
            title="Hapus Lead"
            description={`Apakah Anda yakin ingin menghapus lead "${deleteDialog.leadName}"? Tindakan ini tidak dapat dibatalkan.`}
            confirmLabel="Hapus"
            cancelLabel="Batal"
            onConfirm={confirmDelete}
            variant="destructive"
            isLoading={isLoading}
          />
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
}
