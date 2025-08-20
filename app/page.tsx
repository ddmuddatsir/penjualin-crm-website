"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  NavigationBar,
  HeroSection,
  FeaturesSection,
  DashboardPreview,
  TestimonialsSection,
  Footer,
} from "@/components/home";

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationBar
        isAuthenticated={isAuthenticated}
        userName={user?.displayName || user?.email}
        onGoToDashboard={handleGoToDashboard}
        onLogout={handleLogout}
      />

      <HeroSection
        isAuthenticated={isAuthenticated}
        onGoToDashboard={handleGoToDashboard}
      />

      <DashboardPreview />

      <FeaturesSection />

      <TestimonialsSection />

      <Footer />
    </div>
  );
}
