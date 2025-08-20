"use client";

import { PageLayout } from "@/components/layouts";
import { ConfirmationDialog } from "@/components/ui";
import { useDealsPage } from "@/hooks/useDealsPage";

// Components
import DealFilters from "./components/DealFilters";
import DealTable from "./components/DealTable";
import DealFormDialog from "./components/DealFormDialog";
import ErrorDisplay from "./components/ErrorDisplay";

export default function DealsPage() {
  const {
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
  } = useDealsPage();

  return (
    <PageLayout
      title="Deals"
      subtitle="Kelola semua deals Anda"
      description="Pantau dan kelola transaksi bisnis Anda dengan mudah"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Deals" },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <DealFilters
          search={search}
          setSearch={setSearch}
          status={stage}
          setStatus={setStage}
          onAdd={handleAdd}
        />

        {/* Error Display */}
        <ErrorDisplay
          error={isError ? error : null}
          onRetry={() => refetchDeals()}
        />

        {/* Deals Table */}
        <DealTable
          data={filteredDeals}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Form Dialog */}
        <DealFormDialog
          open={isFormOpen}
          onOpenChange={() => setIsFormOpen(false)}
          isEditing={!!editDeal}
          formData={formData}
          leads={leads}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          isSubmitting={isLoading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            !open && setDeleteDialog({ open: false, dealId: "", dealName: "" })
          }
          title="Hapus Deal"
          description={`Apakah Anda yakin ingin menghapus deal "${deleteDialog.dealName}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmLabel="Hapus"
          cancelLabel="Batal"
          onConfirm={confirmDelete}
          variant="destructive"
          isLoading={isLoading}
        />
      </div>
    </PageLayout>
  );
}
