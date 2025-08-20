import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
import { SIDEBAR_CONFIG } from "../../constants/sidebar";
import type { SidebarUserSectionProps } from "../../types/sidebar";

/**
 * User information dan logout section
 * Menampilkan info user dan tombol logout
 */
export function SidebarUserSection({
  user,
  onLogout,
}: SidebarUserSectionProps) {
  return (
    <div className={SIDEBAR_CONFIG.USER_SECTION_CLASSES}>
      {user && (
        <div className={SIDEBAR_CONFIG.USER_INFO_CLASSES}>
          <User className={`${SIDEBAR_CONFIG.USER_ICON_SIZE} text-zinc-500`} />
          <div className="flex-1 min-w-0">
            <p className={SIDEBAR_CONFIG.USER_NAME_CLASSES}>
              {user.displayName || user.email}
            </p>
            <p className={SIDEBAR_CONFIG.USER_EMAIL_CLASSES}>{user.email}</p>
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className={SIDEBAR_CONFIG.LOGOUT_BUTTON_CLASSES}
      >
        <LogOut className={`${SIDEBAR_CONFIG.LOGOUT_ICON_SIZE} mr-3`} />
        Logout
      </Button>
    </div>
  );
}
