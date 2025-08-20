import { DataTable, StatusBadge } from "@/components/ui";
import { LeadTableProps } from "@/types";
import { Lead } from "@/types";
import { Edit, Trash2 } from "lucide-react";

export default function LeadTable({
  leads,
  isLoading,
  onEdit,
  onDelete,
}: LeadTableProps) {
  const columns = [
    {
      key: "name",
      label: "Nama",
      sortable: true,
    },
    {
      key: "company",
      label: "Perusahaan",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <StatusBadge status={value as string} variant="lead" />
      ),
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (value: unknown, item: Lead) => item.assignedTo?.name || "-",
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
      onClick: (lead: Lead) => lead.id && onDelete(lead.id),
      variant: "destructive" as const,
      icon: <Trash2 className="h-4 w-4" />,
    },
  ];

  return (
    <DataTable
      data={leads}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyTitle="Tidak ada leads"
      emptyDescription="Belum ada lead yang ditambahkan. Mulai dengan menambah lead baru."
      className="overflow-x-auto"
    />
  );
}
