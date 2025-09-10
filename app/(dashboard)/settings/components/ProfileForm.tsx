import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileFormProps } from "@/types";

interface ExtendedProfileFormProps extends Omit<ProfileFormProps, "onSubmit"> {
  onSubmit: (data: { name: string; email: string }) => void;
  isLoading?: boolean;
}

export default function ProfileForm({
  form,
  onSubmit,
  isLoading,
}: ExtendedProfileFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Input placeholder="Nama" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Input placeholder="Email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profil"}
      </Button>
    </form>
  );
}
