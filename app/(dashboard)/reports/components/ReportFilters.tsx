import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReportFiltersProps } from "@/types";

export default function ReportFilters({
  start,
  setStart,
  end,
  setEnd,
  onDownloadPDF,
  onDownloadExcel,
  hasData,
}: ReportFiltersProps) {
  return (
    <div className="flex gap-4 mb-6 items-end">
      <div>
        <label className="block text-xs mb-1">Tanggal Mulai</label>
        <Input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Tanggal Akhir</label>
        <Input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>
      <Button className="ml-auto" onClick={onDownloadPDF} disabled={!hasData}>
        Download PDF
      </Button>
      <Button variant="outline" onClick={onDownloadExcel} disabled={!hasData}>
        Download Excel
      </Button>
    </div>
  );
}
