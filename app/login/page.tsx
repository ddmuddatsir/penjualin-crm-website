"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { NavigationBar } from "@/components/home";
import Link from "next/link";

const schema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithEmail, sendPasswordReset } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await signInWithEmail(data.email, data.password);
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login gagal";
      setError(errorMessage);
    }
  };

  const handleGoogleSuccess = () => {
    router.push("/dashboard");
  };

  const handleGoogleError = (error: Error) => {
    setError(error.message);
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Masukkan email untuk reset password");
      return;
    }

    try {
      await sendPasswordReset(resetEmail);
      setResetMessage("Email reset password telah dikirim!");
      setShowForgotPassword(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengirim email reset";
      setError(errorMessage);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex flex-col bg-background relative">
        <NavigationBar
          isAuthenticated={!!user}
          userName={user?.displayName || user?.email}
          onGoToDashboard={() => router.push("/dashboard")}
          onLogout={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-md shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign in to PenjualinCRM
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Google Sign In */}
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                {!showForgotPassword ? (
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-primary hover:underline"
                    >
                      Lupa password?
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">
                      Email untuk reset password
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="Masukkan email Anda"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleForgotPassword}
                      >
                        Kirim
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Batalkan
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                {resetMessage && (
                  <p className="text-green-600 text-sm text-center">
                    {resetMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                Belum punya akun?{" "}
                <Link href="/register" className="underline hover:text-primary">
                  Register
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
