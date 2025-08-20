import { FormDialog } from "@/components/ui";
import { ClientDeal, ClientLead } from "@/types/firebase";

interface DealFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  isEditing: boolean;
  formData: Partial<ClientDeal>;
  leads: ClientLead[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: unknown) => void;
  isSubmitting: boolean;
}

export default function DealFormDialog({
  open,
  onOpenChange,
  isEditing,
  formData,
  leads,
  onSubmit,
  onChange,
  isSubmitting,
}: DealFormDialogProps) {
  // Form fields configuration
  const formFields = [
    {
      name: "title",
      label: "Judul Deal",
      type: "text" as const,
      placeholder: "Masukkan judul deal",
      required: true,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea" as const,
      placeholder: "Deskripsi deal (opsional)",
      required: false,
    },
    {
      name: "leadId",
      label: "Lead",
      type: "select" as const,
      placeholder: "Pilih lead",
      required: true,
      options: [
        { value: "none", label: "Pilih lead..." },
        ...leads.map((lead: ClientLead) => ({
          value: lead.id,
          label: `${lead.name} - ${lead.company}`,
        })),
      ],
    },
    {
      name: "value",
      label: "Nilai Deal",
      type: "number" as const,
      placeholder: "Masukkan nilai deal",
      required: true,
    },
    {
      name: "stage",
      label: "Status",
      type: "select" as const,
      placeholder: "Pilih status",
      required: true,
      options: [
        { value: "QUALIFIED", label: "Qualified" },
        { value: "PROPOSAL", label: "Proposal" },
        { value: "NEGOTIATION", label: "Negotiation" },
        { value: "CLOSED_WON", label: "Closed Won" },
        { value: "CLOSED_LOST", label: "Closed Lost" },
      ],
    },
    {
      name: "closedAt",
      label: "Tanggal Closed",
      type: "date" as const,
      placeholder: "Pilih tanggal (opsional)",
    },
  ];

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Deal" : "Tambah Deal"}
      description={
        isEditing
          ? "Update informasi deal yang sudah ada"
          : "Tambahkan deal baru ke dalam sistem"
      }
      fields={formFields}
      values={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEditing ? "Update" : "Tambah"}
      cancelLabel="Batal"
    />
  );
}
