"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsers } from "@/hooks/useUsers";
import ProfileForm from "./components/ProfileForm";
import PasswordForm from "./components/PasswordForm";
import RoleManagementTable from "./components/RoleManagementTable";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
const passwordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

// Mock profile data - in real app this would come from session/auth
const mockProfile = {
  name: "Admin CRM",
  email: "admin@crm.com",
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { users = [] } = useUsers();

  // Update profil
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: mockProfile.name, email: mockProfile.email },
  });

  // Update password
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  // mutation for profile/password updates
  const mutation = useMutation({
    mutationFn: async () => alert("Update berhasil"),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  // Role management
  const [editRole, setEditRole] = useState<{ id: string; role: string } | null>(
    null
  );
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) =>
      alert(`Ganti role user ${id} ke ${role}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <PageLayout
      title="Settings"
      subtitle="Kelola profil dan pengaturan akun"
      description="Update informasi profil, password, dan manajemen role"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              form={profileForm}
              onSubmit={() => mutation.mutate()}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ganti Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordForm
              form={passwordForm}
              onSubmit={() => mutation.mutate()}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Role Management (Admin Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleManagementTable
              users={users}
              editRole={editRole}
              setEditRole={setEditRole}
              roleMutation={roleMutation}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
