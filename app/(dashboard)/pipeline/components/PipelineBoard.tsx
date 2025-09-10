import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PipelineColumn from "./PipelineColumn";
import SortableLead from "./SortableLead";
import React, { useState } from "react";
import { PipelineBoardProps } from "@/types";
import { Lead } from "@/types";

export default function PipelineBoard({
  statuses,
  statusLabels,
  statusColors,
  groupedColumns,
  isLoading,
  onAddLead,
  setActiveLead,
  onDragEnd,
}: PipelineBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Debug logging
  console.log("PipelineBoard - isLoading:", isLoading);
  console.log("PipelineBoard - groupedColumns:", groupedColumns);
  console.log("PipelineBoard - statuses:", statuses);

  Object.keys(groupedColumns).forEach((status) => {
    console.log(
      `Status ${status}: ${groupedColumns[status]?.length || 0} leads`
    );
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add some distance to prevent accidental drags
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the dragged lead
    const lead = Object.values(groupedColumns)
      .flat()
      .find((l: Lead) => l.id === active.id);
    setDraggedLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setDraggedLead(null);
    onDragEnd(event);
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 min-w-[900px]">
          {statuses.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              statusLabel={statusLabels[status]}
              statusColor={statusColors[status]}
              leads={groupedColumns[status] || []}
              onAdd={() => onAddLead(status)}
            >
              <SortableContext
                items={groupedColumns[status]?.map((l) => l.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 min-h-[120px]">
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : groupedColumns[status]?.length === 0 ? (
                    <div className="text-gray-400 text-sm">No leads</div>
                  ) : (
                    groupedColumns[status].map((lead) => (
                      <SortableLead
                        key={lead.id}
                        lead={lead}
                        setActiveLead={setActiveLead}
                        status={status}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </PipelineColumn>
          ))}
        </div>

        <DragOverlay>
          {activeId && draggedLead ? (
            <div className="bg-white dark:bg-zinc-900 border rounded p-3 shadow-lg opacity-90 rotate-3 scale-105 transition-transform">
              <div className="font-semibold">{draggedLead.name}</div>
              <div className="text-xs text-gray-500">{draggedLead.company}</div>
              <div className="text-xs text-gray-500">{draggedLead.email}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
