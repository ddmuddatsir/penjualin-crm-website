import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileFormProps } from "@/types";

export default function ProfileForm({ form, onSubmit }: ProfileFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input placeholder="Nama" {...form.register("name")} />
      <Input placeholder="Email" {...form.register("email")} />
      <Button type="submit">Update Profil</Button>
    </form>
  );
}
