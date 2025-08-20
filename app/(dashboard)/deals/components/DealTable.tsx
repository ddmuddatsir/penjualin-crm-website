import { DataTable, StatusBadge } from "@/components/ui";
import { Edit, Trash2 } from "lucide-react";
import { ClientDeal } from "@/types/firebase";

interface DealTableProps {
  data: ClientDeal[];
  onEdit: (deal: ClientDeal) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function DealTable({
  data,
  onEdit,
  onDelete,
  isLoading,
}: DealTableProps) {
  const columns = [
    {
      key: "title",
      label: "Deal",
      render: (value: unknown, item: ClientDeal) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-xs text-gray-500">{item.description || "-"}</div>
        </div>
      ),
    },
    {
      key: "value",
      label: "Nilai",
      sortable: true,
      render: (value: unknown) => {
        const numValue = value as number;
        return `Rp ${(numValue || 0).toLocaleString()}`;
      },
    },
    {
      key: "stage",
      label: "Status",
      render: (value: unknown) => (
        <StatusBadge status={value as string} variant="deal" />
      ),
    },
    {
      key: "expectedCloseDate",
      label: "Target Close",
      render: (value: unknown) => {
        if (!value) return "-";
        try {
          // Handle both Date object and string
          const date =
            value instanceof Date ? value : new Date(value as string);
          return date.toLocaleDateString();
        } catch {
          return "-";
        }
      },
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: onEdit,
      variant: "outline" as const,
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Hapus",
      onClick: (deal: ClientDeal) => deal.id && onDelete(deal.id),
      variant: "destructive" as const,
      icon: <Trash2 className="h-4 w-4" />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyTitle="Tidak ada deals"
      emptyDescription="Belum ada deal yang ditambahkan. Mulai dengan menambah deal baru."
      className="overflow-x-auto"
    />
  );
}
