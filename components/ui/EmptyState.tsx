import React from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "minimal" | "illustration";
}

/**
 * Reusable empty state component
 * Used when tables, lists, or sections have no data
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const baseClasses = "flex flex-col items-center justify-center text-center";

  const variantClasses = {
    default: "py-12 px-6",
    minimal: "py-8 px-4",
    illustration: "py-16 px-8",
  };

  const DefaultIcon = () => (
    <svg
      className="w-12 h-12 text-gray-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4h-2v1"
      />
    </svg>
  );

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {/* Icon */}
      <div className="mb-4">{icon || <DefaultIcon />}</div>

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Predefined empty states for common scenarios
 */
export const EmptyStates = {
  NoData: ({ action }: { action?: React.ReactNode }) => (
    <EmptyState
      title="No data available"
      description="There are no items to display at the moment."
      action={action}
    />
  ),

  NoResults: ({ action }: { action?: React.ReactNode }) => (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filter criteria."
      action={action}
    />
  ),

  NoLeads: ({ action }: { action?: React.ReactNode }) => (
    <EmptyState
      title="No leads yet"
      description="Start building your pipeline by adding your first lead."
      icon={
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      }
      action={action}
    />
  ),

  NoDeals: ({ action }: { action?: React.ReactNode }) => (
    <EmptyState
      title="No deals yet"
      description="Close your first deal and start tracking your revenue."
      icon={
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      action={action}
    />
  ),

  NoActivities: ({ action }: { action?: React.ReactNode }) => (
    <EmptyState
      title="No activities scheduled"
      description="Schedule your first activity to stay on top of your tasks."
      icon={
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
      action={action}
    />
  ),

  Error: ({
    action,
    description,
  }: {
    action?: React.ReactNode;
    description?: string;
  }) => (
    <EmptyState
      title="Something went wrong"
      description={
        description || "We encountered an error while loading the data."
      }
      icon={
        <svg
          className="w-12 h-12 text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      }
      action={action}
    />
  ),
};
