import { FormDialog } from "@/components/ui";
import { ClientLead, ClientUser } from "@/types/firebase";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  isEditing: boolean;
  formData: Partial<ClientLead>;
  users: ClientUser[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (field: string, value: unknown) => void;
  isSubmitting: boolean;
}

export default function LeadFormDialog({
  open,
  onOpenChange,
  isEditing,
  formData,
  users,
  onSubmit,
  onChange,
  isSubmitting,
}: LeadFormDialogProps) {
  // Form fields configuration
  const formFields = [
    {
      name: "name",
      label: "Nama",
      type: "text" as const,
      placeholder: "Masukkan nama lead",
      required: true,
    },
    {
      name: "company",
      label: "Perusahaan",
      type: "text" as const,
      placeholder: "Masukkan nama perusahaan",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "Masukkan email",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "Pilih status",
      required: true,
      options: [
        { value: "OPEN", label: "Open" },
        { value: "CONTACTED", label: "Contacted" },
        { value: "PROPOSAL", label: "Proposal" },
        { value: "CLOSED", label: "Closed" },
      ],
    },
    {
      name: "assignedToId",
      label: "Assigned To",
      type: "select" as const,
      placeholder: "Pilih user (opsional)",
      options: [
        { value: "none", label: "Tidak ada" },
        ...users.map((user) => ({
          value: user.id,
          label: `${user.name} (${user.role})`,
        })),
      ],
    },
  ];

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Lead" : "Tambah Lead"}
      description={
        isEditing
          ? "Update informasi lead yang sudah ada"
          : "Tambahkan lead baru ke dalam sistem"
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
