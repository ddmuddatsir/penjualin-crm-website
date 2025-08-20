import { SIDEBAR_CONFIG } from "../../constants/sidebar";

interface SidebarBrandProps {
  brandName?: string;
  className?: string;
}

/**
 * Brand/Logo section untuk sidebar
 * Komponen untuk menampilkan nama brand atau logo
 */
export function SidebarBrand({
  brandName = SIDEBAR_CONFIG.BRAND_NAME,
  className = SIDEBAR_CONFIG.BRAND_CLASSES,
}: SidebarBrandProps) {
  return <div className={className}>{brandName}</div>;
}
