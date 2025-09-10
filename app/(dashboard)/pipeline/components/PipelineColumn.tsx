import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDroppable } from "@dnd-kit/core";
import { PipelineColumnProps } from "@/types";

export default function PipelineColumn({
  status,
  statusLabel,
  statusColor,
  leads,
  onAdd,
  children,
}: PipelineColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status, // Use the actual status value as droppable ID
  });

  // Default colors jika statusColor undefined
  // Gunakan warna default yang konsisten dengan LEAD_STATUS_BG_BORDER jika tidak ada statusColor
  const defaultStatusColor = {
    bg: "bg-gray-50 dark:bg-gray-950",
    border: "border-gray-200 dark:border-gray-800",
    text: "text-gray-700 dark:text-gray-300",
  };

  // Jika status OPEN dan tidak ada statusColor, gunakan bg-blue-50 dark:bg-blue-950
  let safeStatusColor = statusColor;
  if (!safeStatusColor) {
    if (status === "OPEN") {
      safeStatusColor = {
        bg: "bg-blue-50 dark:bg-blue-950",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
      };
    } else {
      safeStatusColor = defaultStatusColor;
    }
  }

  return (
    <div className="flex-1 min-w-[260px]">
      <Card
        className={`${safeStatusColor.bg} ${safeStatusColor.border} border-2 ${
          isOver ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {statusLabel}
            <span
              className={`text-xs px-2 py-1 rounded-full border ${safeStatusColor.border} ${safeStatusColor.text} bg-white dark:bg-zinc-900`}
            >
              {leads.length} leads
            </span>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            +
          </Button>
        </CardHeader>
        <CardContent
          ref={setNodeRef}
          className="min-h-[200px] transition-colors duration-200"
        >
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
