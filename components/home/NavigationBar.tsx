import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { NavigationBarProps } from "@/types/components";

export function NavigationBar({
  isAuthenticated,
  userName,
  onGoToDashboard,
  onLogout,
}: NavigationBarProps) {
  return (
    <nav className="border-b border-border bg-background px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-bold text-2xl text-primary">PenjualinCRM</span>
          {isAuthenticated ? (
            <span className="text-sm text-muted-foreground">
              Welcome, {userName}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button onClick={onGoToDashboard} size="sm">
                Dashboard
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
