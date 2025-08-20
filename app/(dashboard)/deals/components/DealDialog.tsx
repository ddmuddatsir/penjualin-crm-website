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
import { Button } from "@/components/ui/button";
import { Deal, DealDialogProps } from "@/types";

export default function DealDialog({
  open,
  onOpenChange,
  form,
  leads,
  isEdit,
  isPending,
  onSubmit,
}: DealDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Deal" : "Tambah Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Select
            value={form.watch("leadId") || ""}
            onValueChange={(val) => form.setValue("leadId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Lead" />
            </SelectTrigger>
            <SelectContent>
              {leads.map((l) => (
                <SelectItem key={l.id} value={l.id!}>
                  {l.name} ({l.company})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Nilai Deal"
            {...form.register("dealValue", { valueAsNumber: true })}
          />
          <Select
            value={form.watch("status")}
            onValueChange={(val) =>
              form.setValue("status", val as Deal["status"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="WON">Won</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="Tanggal Closed (opsional)"
            {...form.register("closedAt")}
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
