import { cn } from "./classNames";

/**
 * Generate classes untuk sidebar menu item berdasarkan status aktif
 */
export const getSidebarItemClasses = (isActive: boolean): string => {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm font-medium";
  const activeClasses =
    "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200";
  const inactiveClasses =
    "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200";

  return cn(baseClasses, isActive ? activeClasses : inactiveClasses);
};

/**
 * Check apakah route sedang aktif
 */
export const isRouteActive = (pathname: string, href: string): boolean => {
  return pathname.startsWith(href);
};
