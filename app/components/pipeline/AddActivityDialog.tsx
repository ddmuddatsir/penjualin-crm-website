// app/components/pipeline/AddActivityDialog.tsx
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import {
  useCreateActivity,
  CreateActivityData,
} from "@/hooks/useCreateActivity";
import type { ClientLead } from "@/types/firebase";

type AddActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: ClientLead | null;
};

const ACTIVITY_TYPES = [
  { value: "CALL", label: "Phone Call" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Meeting" },
  { value: "NOTE", label: "Note" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "CONTRACT", label: "Contract" },
  { value: "DEMO", label: "Demo" },
];

const PRIORITY_LEVELS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export function AddActivityDialog({
  open,
  onOpenChange,
  lead,
}: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    priority: "MEDIUM" as const,
    notes: "",
  });

  const createActivity = useCreateActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lead || !formData.type || !formData.description) return;

    const activityData: CreateActivityData = {
      type: formData.type as
        | "CALL"
        | "EMAIL"
        | "MEETING"
        | "NOTE"
        | "TASK"
        | "OTHER",
      description:
        formData.description + (formData.notes ? ` - ${formData.notes}` : ""),
      leadId: lead.id,
      userId: "admin", // Default user - could be dynamic
      metadata: {
        priority: formData.priority,
        notes: formData.notes,
      },
    };

    try {
      await createActivity.mutateAsync(activityData);

      // Reset form and close dialog
      setFormData({
        type: "",
        description: "",
        priority: "MEDIUM",
        notes: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create activity:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Tambah Activity untuk {lead.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Activity</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe activity" />
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("description", e.target.value)
              }
              placeholder="Contoh: Called to discuss pricing options"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("notes", e.target.value)
              }
              placeholder="Tambahan catatan atau detail..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.type ||
                !formData.description ||
                createActivity.isPending
              }
              className="flex-1"
            >
              {createActivity.isPending ? "Menyimpan..." : "Tambah Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
