import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types";

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  activityData: { type: string; title: string; notes: string; date: string };
  setActivityData: (data: {
    type: string;
    title: string;
    notes: string;
    date: string;
  }) => void;
  onSubmit: () => void;
  isPending?: boolean;
}

const ACTIVITY_TYPES = [
  { value: "CALL", label: "Telepon" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Meeting" },
  { value: "DEMO", label: "Demo" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "NOTE", label: "Catatan" },
];

export default function AddActivityDialog({
  open,
  onOpenChange,
  lead,
  activityData,
  setActivityData,
  onSubmit,
  isPending = false,
}: AddActivityDialogProps) {
  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityData.type && activityData.title && activityData.notes) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Aktivitas</DialogTitle>
          <p className="text-sm text-gray-600">
            Tambah aktivitas untuk: <strong>{lead.name}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Jenis Aktivitas</Label>
            <Select
              value={activityData.type}
              onValueChange={(value) =>
                setActivityData({ ...activityData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis aktivitas" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Aktivitas</Label>
            <Input
              id="title"
              value={activityData.title}
              onChange={(e) =>
                setActivityData({ ...activityData, title: e.target.value })
              }
              placeholder="Judul singkat aktivitas..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={activityData.date}
              onChange={(e) =>
                setActivityData({ ...activityData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <textarea
              id="notes"
              value={activityData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setActivityData({ ...activityData, notes: e.target.value })
              }
              placeholder="Tulis catatan aktivitas..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !activityData.type ||
                !activityData.title ||
                !activityData.notes
              }
            >
              {isPending ? "Menyimpan..." : "Tambah Aktivitas"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
