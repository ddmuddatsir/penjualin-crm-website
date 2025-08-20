import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordFormProps } from "@/types";

export default function PasswordForm({ form, onSubmit }: PasswordFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input
        type="password"
        placeholder="Password Lama"
        {...form.register("oldPassword")}
      />
      <Input
        type="password"
        placeholder="Password Baru"
        {...form.register("newPassword")}
      />
      <Button type="submit">Update Password</Button>
    </form>
  );
}
