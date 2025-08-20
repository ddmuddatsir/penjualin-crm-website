import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserSection } from "./SidebarUserSection";
import { SIDEBAR_CONFIG } from "../../constants/sidebar";
import type { MenuItem } from "../../types/sidebar";
import type { User } from "firebase/auth";

interface SidebarContentProps {
  menuItems: MenuItem[];
  isActiveRoute: (href: string) => boolean;
  user: User | null;
  onLogout: () => void;
  onClick?: () => void;
}

/**
 * Content wrapper untuk sidebar
 * Menggabungkan navigation dan user section
 */
export function SidebarContent({
  menuItems,
  isActiveRoute,
  user,
  onLogout,
  onClick,
}: SidebarContentProps) {
  return (
    <div className={SIDEBAR_CONFIG.MENU_CONTAINER_CLASSES}>
      <SidebarNavigation
        menuItems={menuItems}
        isActiveRoute={isActiveRoute}
        onClick={onClick}
      />
      <SidebarUserSection user={user} onLogout={onLogout} />
    </div>
  );
}
