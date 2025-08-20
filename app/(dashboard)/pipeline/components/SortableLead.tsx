import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import {
  STATUS_COLORS,
  COLOR_GRAY_MEDIUM,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  COLOR_SHADOW,
} from "@/lib/colors";
import { SortableLeadProps } from "@/types";

function statusColor(status: string) {
  return STATUS_COLORS[status] || COLOR_GRAY_MEDIUM;
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
  } = useSortable({ id: lead.id });
  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ scale: 1 }}
      animate={{
        scale: isDragging ? 1.05 : 1,
        boxShadow: isDragging ? COLOR_SHADOW : "none",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? COLOR_GRAY_LIGHT : undefined,
        borderLeft: `4px solid ${statusColor(status)}`,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
      onClick={() => setActiveLead(lead)}
      className="bg-white dark:bg-zinc-900 border rounded p-3 shadow-sm flex flex-col gap-1"
    >
      <div className="font-semibold flex items-center gap-2">
        {lead.name}
        <span
          className={`text-xs px-2 py-0.5 rounded-full`}
          style={{ background: statusColor(status), color: COLOR_WHITE }}
        >
          {status}
        </span>
      </div>
      <div className="text-xs text-gray-500">{lead.company}</div>
      <div className="text-xs text-gray-500">{lead.email}</div>
    </motion.div>
  );
}
