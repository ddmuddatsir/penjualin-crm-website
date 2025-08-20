import { FilterBar } from "@/components/ui";
import type { ActivityFiltersProps } from "@/types";

type ActivityType = "MEETING" | "CALL" | "DEMO" | "EMAIL";

const ACTIVITY_TYPES: ActivityType[] = ["MEETING", "CALL", "DEMO", "EMAIL"];

export default function ActivityFilters({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  search,
  setSearch,
}: ActivityFiltersProps) {
  const fields = [
    {
      key: "search",
      label: "Search",
      type: "search" as const,
      placeholder: "Cari aktivitas atau lead...",
      value: search,
      onChange: (value: string | string[]) => setSearch(value as string),
      className: "md:w-1/3",
    },
    {
      key: "type",
      label: "Tipe",
      type: "select" as const,
      placeholder: "Tipe",
      value: filterType,
      onChange: (value: string | string[]) => setFilterType(value as string),
      options: [
        { key: "all", label: "Semua", value: "all" },
        ...ACTIVITY_TYPES.map((type) => ({
          key: type,
          label: type,
          value: type,
        })),
      ],
      className: "w-32",
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "Status",
      value: filterStatus,
      onChange: (value: string | string[]) => setFilterStatus(value as string),
      options: [
        { key: "all", label: "Semua", value: "all" },
        { key: "upcoming", label: "Upcoming", value: "upcoming" },
        { key: "done", label: "Done", value: "done" },
      ],
      className: "w-32",
    },
  ];

  return <FilterBar fields={fields} className="mb-2" />;
}
