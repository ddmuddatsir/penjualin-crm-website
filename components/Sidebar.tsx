"use client";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SidebarBrand } from "./Sidebar/SidebarBrand";
import { SidebarContent } from "./Sidebar/SidebarContent";

// Clean code imports
import { useSidebar } from "../hooks/useSidebar";
import { useSidebarMenu } from "../hooks/useSidebarMenu";

export function Sidebar() {
  const { open, setOpen, handleLogout, user, isActiveRoute } = useSidebar();
  const { menuItems } = useSidebarMenu();

  return (
    <>
      {/* Mobile: Sheet/Drawer */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-56">
            <SidebarBrand />
            <SidebarContent
              menuItems={menuItems}
              isActiveRoute={isActiveRoute}
              user={user}
              onLogout={handleLogout}
              onClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sticky Sidebar */}
      <div className="hidden md:flex w-56 flex-col bg-background border-r h-screen sticky top-0 p-4">
        <SidebarBrand />
        <SidebarContent
          menuItems={menuItems}
          isActiveRoute={isActiveRoute}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
}
