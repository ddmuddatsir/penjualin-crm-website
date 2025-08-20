import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PipelineFiltersProps, LeadFilters } from "@/types";

export default function PipelineFilters({
  filters,
  setFilters,
  statuses,
  statusLabels,
}: PipelineFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <Input
        placeholder="Cari nama/perusahaan..."
        value={filters.q}
        onChange={(e) =>
          setFilters((f: LeadFilters) => ({ ...f, q: e.target.value }))
        }
        className="max-w-xs"
      />
      <Select
        value={filters.status}
        onValueChange={(val) =>
          setFilters((f: LeadFilters) => ({ ...f, status: val }))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {statusLabels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.owner}
        onValueChange={(val) =>
          setFilters((f: LeadFilters) => ({ ...f, owner: val }))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Sales Owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Sales</SelectItem>
          {/* Map user sales/manager di sini jika ada */}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={filters.date}
        onChange={(e) =>
          setFilters((f: LeadFilters) => ({ ...f, date: e.target.value }))
        }
        className="w-36"
      />
    </div>
  );
}
