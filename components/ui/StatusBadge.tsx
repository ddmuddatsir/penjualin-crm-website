import React from "react";
import { cn } from "../../lib/utils";

export interface StatusBadgeProps {
  status: string;
  variant?: "lead" | "deal" | "activity" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Reusable status badge component
 * Eliminates duplicate status styling across the app
 */
export function StatusBadge({
  status,
  variant = "default",
  size = "md",
  className,
}: StatusBadgeProps) {
  // Size variants
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Color mappings for different variants
  const getStatusColors = (status: string, variant: string) => {
    const colorMaps = {
      lead: {
        NEW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        CONTACTED:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        QUALIFIED:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        CONVERTED:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
      deal: {
        OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        WON: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        ON_HOLD:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
      activity: {
        PENDING:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        COMPLETED:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        IN_PROGRESS:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
      default: {
        ACTIVE:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        INACTIVE:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        PENDING:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        SUCCESS:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        WARNING:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    };

    const variantMap =
      colorMaps[variant as keyof typeof colorMaps] || colorMaps.default;
    return variantMap[status as keyof typeof variantMap] || variantMap.default;
  };

  const statusColors = getStatusColors(status, variant);

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        sizeClasses[size],
        statusColors,
        className
      )}
    >
      {status}
    </span>
  );
}
