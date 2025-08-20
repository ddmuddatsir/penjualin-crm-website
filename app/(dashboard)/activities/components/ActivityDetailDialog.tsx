import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActivityDetailDialogProps } from "@/types";

export default function ActivityDetailDialog({
  activity,
  onOpenChange,
}: ActivityDetailDialogProps) {
  return (
    <Dialog open={!!activity} onOpenChange={() => onOpenChange(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Aktivitas</DialogTitle>
        </DialogHeader>
        {activity && (
          <div className="space-y-2">
            <div className="font-bold text-lg">{activity.title}</div>
            <div>Tipe: {activity.type}</div>
            <div>Lead: {activity.lead?.name || "-"}</div>
            <div>Tanggal: {new Date(activity.date).toLocaleString()}</div>
            <div>Catatan: {activity.notes || "-"}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
