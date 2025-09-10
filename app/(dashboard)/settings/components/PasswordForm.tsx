import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordFormProps } from "@/types";

interface ExtendedPasswordFormProps
  extends Omit<PasswordFormProps, "onSubmit"> {
  onSubmit: (data: { oldPassword: string; newPassword: string }) => void;
  isLoading?: boolean;
}

export default function PasswordForm({
  form,
  onSubmit,
  isLoading,
}: ExtendedPasswordFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Input
          type="password"
          placeholder="Password Lama"
          {...form.register("oldPassword")}
        />
        {form.formState.errors.oldPassword && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.oldPassword.message}
          </p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password Baru"
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
