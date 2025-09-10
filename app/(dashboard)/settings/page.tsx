"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ProfileForm from "./components/ProfileForm";
import PasswordForm from "./components/PasswordForm";
import RoleManagementTable from "./components/RoleManagementTable";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Password minimal 6 karakter"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { users = [] } = useUsers();
  const { user, userData, updateProfile, updatePassword } = useAuth();

  // Update profil
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData || user) {
      profileForm.reset({
        name: userData?.name || user?.displayName || "",
        email: userData?.email || user?.email || "",
      });
    }
  }, [userData, user, profileForm]);

  // Update password
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  // Mutation for profile update
  const profileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      await updateProfile(data);
    },
    onSuccess: () => {
      toast({
        title: "Profil berhasil diupdate",
        description: "Informasi profil Anda telah diperbarui.",
      });
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal update profil",
        description:
          error.message || "Terjadi kesalahan saat mengupdate profil.",
        variant: "destructive",
      });
    },
  });

  // Mutation for password update
  const passwordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      await updatePassword(data.oldPassword, data.newPassword);
    },
    onSuccess: () => {
      toast({
        title: "Password berhasil diubah",
        description: "Password Anda telah diperbarui.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal ubah password",
        description:
          error.message || "Terjadi kesalahan saat mengubah password.",
        variant: "destructive",
      });
    },
  });

  return (
    <PageLayout
      title="Settings"
      subtitle="Kelola profil dan pengaturan akun"
      description="Update informasi profil, password, dan lihat role pengguna"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <div className="space-y-6">
        {/* Profile and Password Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm
                form={profileForm}
                onSubmit={(data) => profileMutation.mutate(data)}
                isLoading={profileMutation.isPending}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {user &&
                user.providerData.some((p) => p.providerId === "google.com")
                  ? "Pengelolaan Password Google"
                  : "Ganti Password"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user &&
              user.providerData.some((p) => p.providerId === "google.com") ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-base font-medium">
                    Anda login menggunakan Google.
                  </p>
                  <p className="text-sm">
                    Untuk mengubah password, silakan kelola melalui akun Google
                    Anda.
                  </p>
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:underline text-sm"
                  >
                    Kelola password di Google
                  </a>
                </div>
              ) : (
                <PasswordForm
                  form={passwordForm}
                  onSubmit={(data) => passwordMutation.mutate(data)}
                  isLoading={passwordMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role Management - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleManagementTable users={users} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
