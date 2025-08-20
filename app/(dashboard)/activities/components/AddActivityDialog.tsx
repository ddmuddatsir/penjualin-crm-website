import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, User, AddActivityDialogProps, ActivityType } from "@/types";

const ACTIVITY_TYPES: ActivityType[] = ["MEETING", "CALL", "DEMO", "EMAIL"];

export default function AddActivityDialog({
  open,
  onOpenChange,
  form,
  setForm,
  leads,
  users,
  selectedDate,
  onSubmit,
  isPending,
}: AddActivityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Aktivitas</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              ...form,
              date: selectedDate.toISOString().slice(0, 10),
            });
          }}
          className="space-y-3"
        >
          <Select
            value={form.type}
            onValueChange={(val) =>
              setForm({
                ...form,
                type: val as ActivityType,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipe Aktivitas" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((t: ActivityType) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Judul"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Select
            value={(form.leadId ?? "none") + ""}
            onValueChange={(val) =>
              setForm({
                ...form,
                leadId: val === "none" ? "" : val,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Lead" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-</SelectItem>
              {leads.map((l: Lead) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={(form.userId ?? "none") + ""}
            onValueChange={(val) =>
              setForm({
                ...form,
                userId: val === "none" ? "" : val,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-</SelectItem>
              {users.map((u: User) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Catatan"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
