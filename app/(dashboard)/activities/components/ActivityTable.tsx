import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isFuture, isPast } from "date-fns";
import type { ActivityTableProps } from "@/types";
import { ACTIVITY_TYPE_ICONS, type ActivityType } from "@/constants/activity";

const ACTIVITY_ICONS = ACTIVITY_TYPE_ICONS;

function getStatus(dateStr: string): {
  label: string;
  color: "secondary" | "default" | "outline";
} {
  const date = new Date(dateStr);
  if (isToday(date)) return { label: "Today", color: "secondary" };
  if (isFuture(date)) return { label: "Upcoming", color: "default" };
  if (isPast(date)) return { label: "Done", color: "outline" };
  return { label: "-", color: "outline" };
}

export default function ActivityTable({
  activities,
  isLoading,
  selectedDate,
}: ActivityTableProps) {
  const columns = [
    {
      key: "createdAt",
      label: "Tanggal",
      sortable: true,
      render: (value: unknown) => {
        if (!value) return "-";
        try {
          // Handle both Date object and string
          const date =
            value instanceof Date ? value : new Date(value as string);
          return format(date, "dd/MM/yyyy HH:mm");
        } catch {
          return "-";
        }
      },
    },
    {
      key: "description",
      label: "Deskripsi Aktivitas",
      sortable: true,
    },
    {
      key: "leadId",
      label: "Lead ID",
      render: (value: unknown) => (value as string) || "-",
    },
    {
      key: "type",
      label: "Tipe",
      render: (value: unknown) => (
        <span>
          <span className="mr-1">
            {ACTIVITY_ICONS[value as ActivityType] || ""}
          </span>
          {value as string}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown, item: Record<string, unknown>) => {
        try {
          const createdAt = item.createdAt;
          const date =
            createdAt instanceof Date
              ? createdAt
              : new Date(createdAt as string);
          const status = getStatus(date.toISOString());
          return <Badge variant={status.color}>{status.label}</Badge>;
        } catch {
          return <Badge variant="outline">-</Badge>;
        }
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Aktivitas pada {selectedDate.toLocaleDateString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={activities as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="Tidak ada aktivitas"
          emptyDescription="Tidak ada aktivitas pada tanggal ini."
        />
      </CardContent>
    </Card>
  );
}
