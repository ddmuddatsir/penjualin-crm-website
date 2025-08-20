import {
  Home,
  Users,
  MoveRight,
  Calendar,
  BarChart,
  Settings,
  DollarSign,
} from "lucide-react";
import type { MenuItem } from "../types/sidebar";

/**
 * Custom hook untuk mengelola menu items
 * Centralized place untuk menu configuration
 */
export const useSidebarMenu = () => {
  /**
   * Menu items configuration
   * Bisa dipindah ke config file atau database di masa depan
   */
  const menuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Leads", href: "/leads" },
    { icon: MoveRight, label: "Pipeline", href: "/pipeline" },
    { icon: DollarSign, label: "Deals", href: "/deals" },
    { icon: Calendar, label: "Activities", href: "/activities" },
    { icon: BarChart, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  /**
   * Get menu item by href
   */
  const getMenuItem = (href: string): MenuItem | undefined => {
    return menuItems.find((item) => item.href === href);
  };

  /**
   * Get menu items filtered by condition
   */
  const getFilteredMenuItems = (
    filterFn: (item: MenuItem) => boolean
  ): MenuItem[] => {
    return menuItems.filter(filterFn);
  };

  return {
    menuItems,
    getMenuItem,
    getFilteredMenuItems,
  };
};
