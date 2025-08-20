import Link from "next/link";
import { getSidebarItemClasses } from "../../utils/sidebar";
import { SIDEBAR_CONFIG } from "../../constants/sidebar";
import type { SidebarMenuItemProps } from "../../types/sidebar";

/**
 * Individual menu item component
 * Handles single navigation item dengan styling dan interaction
 */
export function SidebarMenuItem({
  item,
  isActive,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={getSidebarItemClasses(isActive)}
    >
      <item.icon className={SIDEBAR_CONFIG.MENU_ICON_SIZE} />
      <span>{item.label}</span>
    </Link>
  );
}
