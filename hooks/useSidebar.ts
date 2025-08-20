"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isRouteActive } from "../utils/sidebar";

/**
 * Custom hook untuk mengelola state dan logic sidebar
 * Extract semua logic dari komponen Sidebar untuk better separation of concerns
 */
export const useSidebar = () => {
  // State management
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  /**
   * Check apakah route sedang aktif
   */
  const isActiveRoute = (href: string): boolean => {
    return isRouteActive(pathname, href);
  };

  /**
   * Handle logout dengan redirect ke login page
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Close sidebar (untuk mobile)
   */
  const closeSidebar = (): void => {
    setOpen(false);
  };

  /**
   * Open sidebar (untuk mobile)
   */
  const openSidebar = (): void => {
    setOpen(true);
  };

  /**
   * Toggle sidebar state
   */
  const toggleSidebar = (): void => {
    setOpen((prev) => !prev);
  };

  return {
    // State
    pathname,
    user,
    open,

    // Actions
    setOpen,
    isActiveRoute,
    handleLogout,
    closeSidebar,
    openSidebar,
    toggleSidebar,
  };
};
