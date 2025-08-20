import PipelineFilters from "./PipelineFilters";
import PipelineBoard from "./PipelineBoard";
import AddLeadDialog from "./AddLeadDialog";
import EditLeadDialog from "./EditLeadDialog";
import { LeadDetailDrawer } from "@/app/components/pipeline/LeadDetailDrawer";
import { LEAD_STATUS_BG_BORDER } from "@/lib/colors";
import { usePipelinePage } from "@/hooks/usePipelinePage";

export default function PipelineContainer() {
  const {
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

    // Data
    isLoading,
    groupedColumns,

    // Mutations
    addLeadMutation,
    editLeadMutation,

    // Handlers
    handleDragEnd,
    handleAddLead,
    handleCloseAddDialog,
    handleSubmitNewLead,
    handleCloseLeadDetail,
    handleEditLead,
    handleCloseEditLead,
    handleSubmitEditLead,
  } = usePipelinePage();

  return (
    <div className="overflow-x-auto">
      {/* Filters */}
      <PipelineFilters
        filters={filters}
        setFilters={setFilters}
        statuses={STATUSES}
        statusLabels={STATUS_LABELS}
      />

      {/* Pipeline Board */}
      <PipelineBoard
        statuses={STATUSES}
        statusLabels={STATUS_LABELS}
        statusColors={LEAD_STATUS_BG_BORDER}
        groupedColumns={Object.fromEntries(
          Object.entries(groupedColumns).map(([status, leads]) => [
            status,
            leads.map((lead) => ({
              ...lead,
              assignedTo: lead.assignedTo
                ? {
                    id: lead.assignedTo,
                    name: lead.assignedTo,
                    email: "",
                  }
                : null,
              assignedToId: lead.assignedTo || null,
            })),
          ])
        )}
        isLoading={isLoading}
        onAddLead={handleAddLead}
        setActiveLead={(lead) => {
          // Convert Lead type to ClientLead type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setActiveLead(lead as any);
        }}
        onDragEnd={handleDragEnd}
      />

      {/* Add Lead Dialog */}
      <AddLeadDialog
        open={!!addStatus}
        onOpenChange={handleCloseAddDialog}
        newLead={newLead}
        setNewLead={setNewLead}
        onSubmit={handleSubmitNewLead}
        isPending={addLeadMutation.isPending}
        statusLabel={
          addStatus
            ? STATUS_LABELS[addStatus as keyof typeof STATUS_LABELS]
            : undefined
        }
      />

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        open={!!activeLead}
        onOpenChange={handleCloseLeadDetail}
        lead={activeLead}
        onEdit={handleEditLead}
      />

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        open={!!editLead}
        onOpenChange={handleCloseEditLead}
        lead={
          editLead
            ? {
                ...editLead,
                assignedTo: editLead.assignedTo
                  ? {
                      id: editLead.assignedTo,
                      name: editLead.assignedTo,
                      email: "",
                    }
                  : null,
                assignedToId: editLead.assignedTo || null,
              }
            : null
        }
        formData={newLead}
        setFormData={setNewLead}
        onSubmit={handleSubmitEditLead}
        isPending={editLeadMutation.isPending}
      />
    </div>
  );
}
