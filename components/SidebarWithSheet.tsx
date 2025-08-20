"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Users,
  Handshake,
  Calendar,
  GitBranch,
  BarChart3,
  Settings,
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Constants
import { SIDEBAR_CONFIG, SIDEBAR_MENU_ITEMS } from "@/constants/sidebar";

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

// Icon mapping
const iconMap = {
  LayoutDashboard,
  Users,
  Handshake,
  Calendar,
  GitBranch,
  BarChart3,
  Settings,
} as const;

export function Sidebar({ userName, userEmail, userImage }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle navigation untuk mobile - close sheet setelah navigasi
  const handleNavigation = () => {
    setOpen(false);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={SIDEBAR_CONFIG.MENU_CONTAINER_CLASSES}>
      {/* Brand - hanya untuk mobile karena desktop sudah ada header terpisah */}
      {isMobile && (
        <div className={SIDEBAR_CONFIG.SHEET_HEADER_CLASSES}>
          <Link
            href="/dashboard"
            className={SIDEBAR_CONFIG.BRAND_CLASSES}
            onClick={handleNavigation}
          >
            {SIDEBAR_CONFIG.BRAND_NAME}
          </Link>
        </div>
      )}

      {/* Brand untuk desktop */}
      {!isMobile && (
        <Link href="/dashboard" className={SIDEBAR_CONFIG.BRAND_CLASSES}>
          {SIDEBAR_CONFIG.BRAND_NAME}
        </Link>
      )}

      {/* Navigation */}
      <nav className={SIDEBAR_CONFIG.NAV_CLASSES}>
        {SIDEBAR_MENU_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                SIDEBAR_CONFIG.NAV_ITEM_CLASSES,
                isActive
                  ? SIDEBAR_CONFIG.NAV_ITEM_ACTIVE_CLASSES
                  : SIDEBAR_CONFIG.NAV_ITEM_INACTIVE_CLASSES
              )}
              asChild
            >
              <Link
                href={item.href}
                onClick={isMobile ? handleNavigation : undefined}
              >
                <Icon className={cn(SIDEBAR_CONFIG.MENU_ICON_SIZE, "mr-3")} />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={SIDEBAR_CONFIG.USER_SECTION_CLASSES}>
        <Separator className={SIDEBAR_CONFIG.SEPARATOR_CLASSES} />

        {/* User Info */}
        <div className={SIDEBAR_CONFIG.USER_INFO_CLASSES}>
          <Avatar className={SIDEBAR_CONFIG.AVATAR_CLASSES}>
            <AvatarImage
              src={userImage || undefined}
              alt={userName || "User"}
            />
            <AvatarFallback className={SIDEBAR_CONFIG.AVATAR_FALLBACK_CLASSES}>
              {getUserInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={SIDEBAR_CONFIG.USER_NAME_CLASSES}>
              {userName || "User"}
            </p>
            <p className={SIDEBAR_CONFIG.USER_EMAIL_CLASSES}>
              {userEmail || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={SIDEBAR_CONFIG.LOGOUT_BUTTON_CLASSES}
        >
          <LogOut className={cn(SIDEBAR_CONFIG.LOGOUT_ICON_SIZE, "mr-3")} />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(SIDEBAR_CONFIG.DESKTOP_CLASSES, SIDEBAR_CONFIG.WIDTH)}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar dengan Sheet */}
      <div className={SIDEBAR_CONFIG.MOBILE_TRIGGER_CLASSES}>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={SIDEBAR_CONFIG.MOBILE_TRIGGER_BUTTON_CLASSES}
            >
              <Menu className={SIDEBAR_CONFIG.MOBILE_TRIGGER_ICON_SIZE} />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={SIDEBAR_CONFIG.MOBILE_SHEET_CLASSES}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className={SIDEBAR_CONFIG.SHEET_CONTENT_CLASSES}>
              <SidebarContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default Sidebar;
