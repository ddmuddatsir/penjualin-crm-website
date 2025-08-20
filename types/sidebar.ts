import { LucideIcon } from "lucide-react";
import { User } from "firebase/auth";

/**
 * Type definition untuk menu item
 */
export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

/**
 * Type definition untuk session user data (legacy - kept for backward compatibility)
 */
export interface SessionUser {
  name?: string | null;
  email?: string | null;
}

/**
 * Type definition untuk session data (legacy - kept for backward compatibility)
 */
export interface SessionData {
  user?: SessionUser;
}

/**
 * Props untuk SidebarMenu component
 */
export interface SidebarMenuProps {
  pathname: string;
  onClick?: () => void;
  user: User | null;
  onLogout: () => void;
}

/**
 * Props untuk SidebarMenuItem component
 */
export interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * Props untuk SidebarUserSection component
 */
export interface SidebarUserSectionProps {
  user: User | null;
  onLogout: () => void;
}
