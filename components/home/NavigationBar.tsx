import { Button } from "@/components/ui/button";
import {
  COLOR_BLUE_600,
  COLOR_GRAY_100,
  COLOR_GRAY_500,
  COLOR_WHITE,
} from "@/lib/colors";
import type { NavigationBarProps } from "@/types/components";

export function NavigationBar({
  isAuthenticated,
  userName,
  onGoToDashboard,
  onLogout,
}: NavigationBarProps) {
  if (!isAuthenticated) return null;

  return (
    <nav
      className="border-b px-4 py-3"
      style={{
        background: COLOR_WHITE,
        borderBottomColor: COLOR_GRAY_100,
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span
            className="font-bold text-2xl"
            style={{ color: COLOR_BLUE_600 }}
          >
            PenjualinCRM
          </span>
          <span className="text-sm" style={{ color: COLOR_GRAY_500 }}>
            Welcome, {userName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onGoToDashboard} size="sm">
            Dashboard
          </Button>
          <Button onClick={onLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
