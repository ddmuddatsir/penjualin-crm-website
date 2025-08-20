import { SidebarMenuItem } from "./SidebarMenuItem";
import { SIDEBAR_CONFIG } from "../../constants/sidebar";
import type { MenuItem } from "../../types/sidebar";

interface SidebarNavigationProps {
  menuItems: MenuItem[];
  isActiveRoute: (href: string) => boolean;
  onClick?: () => void;
}

/**
 * Navigation section dengan semua menu items
 * Mengelola list menu navigation
 */
export function SidebarNavigation({
  menuItems,
  isActiveRoute,
  onClick,
}: SidebarNavigationProps) {
  return (
    <nav className={SIDEBAR_CONFIG.NAV_CLASSES}>
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.href}
          item={item}
          isActive={isActiveRoute(item.href)}
          onClick={onClick}
        />
      ))}
    </nav>
  );
}
