import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { STATUS_COLORS } from "@/lib/colors";
import { SortableLeadProps } from "@/types";

function statusColor(status: string) {
  return STATUS_COLORS[status] || "#6b7280"; // gray-500 fallback
}

export default function SortableLead({
  lead,
  setActiveLead,
  status,
}: SortableLeadProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "lead",
      lead,
    },
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      key={lead.id} // Ensure stable key
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging ? 1.05 : 1,
        boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
        opacity: isDragging ? 0.8 : 1, // Add opacity change for feedback
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition, // Disable transition during drag
        background: isDragging ? "rgb(243 244 246)" : undefined, // gray-100
        borderLeft: `4px solid ${statusColor(status)}`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...attributes}
      {...listeners}
      onClick={() => setActiveLead(lead)}
      className="bg-card border border-border rounded p-3 shadow-sm flex flex-col gap-1 dark:bg-card"
    >
      <div className="font-semibold flex items-center gap-2 text-foreground">
        {lead.name}
        <span
          className="text-xs px-2 py-0.5 rounded-full text-white"
          style={{ background: statusColor(status) }}
        >
          {status}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">{lead.company}</div>
      <div className="text-xs text-muted-foreground">{lead.email}</div>
    </motion.div>
  );
}
