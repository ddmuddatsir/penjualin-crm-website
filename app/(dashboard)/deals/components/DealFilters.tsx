import { FilterBar } from "@/components/ui";
import { DealFiltersProps } from "@/types";
import { Plus } from "lucide-react";

export default function DealFilters({
  search,
  setSearch,
  status,
  setStatus,
  onAdd,
}: DealFiltersProps) {
  const fields = [
    {
      key: "search",
      label: "Search",
      type: "search" as const,
      placeholder: "Cari nama lead, perusahaan, email...",
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
        { key: "WON", label: "Won", value: "WON" },
        { key: "LOST", label: "Lost", value: "LOST" },
      ],
      className: "w-40",
    },
  ];

  const actions = [
    {
      label: "Tambah Deal",
      onClick: onAdd,
      variant: "default" as const,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return <FilterBar fields={fields} actions={actions} className="mb-4" />;
}
