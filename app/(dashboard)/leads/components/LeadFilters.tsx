import { FilterBar } from "@/components/ui";
import { LeadFiltersProps } from "@/types";
import { Plus } from "lucide-react";

export default function LeadFilters({
  search,
  setSearch,
  status,
  setStatus,
  onAdd,
}: LeadFiltersProps) {
  const fields = [
    {
      key: "search",
      label: "Search",
      type: "search" as const,
      placeholder: "Cari nama, perusahaan, email...",
      value: search,
      onChange: (value: string | string[]) => setSearch(value as string),
      className: "max-w-xs",
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "Filter Status",
      value: status,
      onChange: (value: string | string[]) => setStatus(value as string),
      options: [
        { key: "all", label: "Semua Status", value: "all" },
        { key: "OPEN", label: "Open", value: "OPEN" },
        { key: "CONTACTED", label: "Contacted", value: "CONTACTED" },
        { key: "PROPOSAL", label: "Proposal", value: "PROPOSAL" },
        { key: "CLOSED", label: "Closed", value: "CLOSED" },
      ],
      className: "w-40",
    },
  ];

  const actions = [
    {
      label: "Tambah Lead",
      onClick: onAdd,
      variant: "default" as const,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return <FilterBar fields={fields} actions={actions} className="mb-4" />;
}
