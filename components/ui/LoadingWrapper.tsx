import React from "react";
import { cn } from "../../lib/utils";

export interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: "spinner" | "skeleton" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Reusable loading wrapper component
 * Eliminates duplicate loading state handling across the app
 */
export function LoadingWrapper({
  isLoading,
  children,
  fallback,
  variant = "spinner",
  size = "md",
  className,
}: LoadingWrapperProps) {
  // If custom fallback is provided, use it
  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  // If not loading, render children
  if (!isLoading) {
    return <>{children}</>;
  }

  // Default loading states based on variant
  const renderLoadingState = () => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    const containerClasses = cn(
      "flex items-center justify-center p-8",
      className
    );

    switch (variant) {
      case "spinner":
        return (
          <div className={containerClasses}>
            <div
              className={cn(
                "animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600",
                sizeClasses[size]
              )}
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );

      case "dots":
        return (
          <div className={containerClasses}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        );

      case "pulse":
        return (
          <div className={containerClasses}>
            <div
              className={cn(
                "bg-blue-600 rounded animate-pulse",
                sizeClasses[size]
              )}
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );

      case "skeleton":
        return (
          <div className={cn("animate-pulse space-y-4 p-4", className)}>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className={containerClasses}>
            <div
              className={cn(
                "animate-spin rounded-full border-2 border-current border-t-transparent text-blue-600",
                sizeClasses[size]
              )}
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );
    }
  };

  return renderLoadingState();
}

/**
 * Loading Spinner Component (standalone)
 */
export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Loading Dots Component (standalone)
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
}
