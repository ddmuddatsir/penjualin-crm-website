import { Button } from "@/components/ui/button";
import type { NavigationBarProps } from "@/types/components";

export function NavigationBar({
  isAuthenticated,
  userName,
  onGoToDashboard,
  onLogout,
}: NavigationBarProps) {
  if (!isAuthenticated) return null;

  return (
    <nav className="border-b border-border bg-background px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-bold text-2xl text-primary">PenjualinCRM</span>
          <span className="text-sm text-muted-foreground">
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
