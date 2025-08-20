import React from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageLayoutProps } from "@/types/layout";

export function PageLayout({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryActions,
  children,
  breadcrumbs,
  className,
  headerClassName,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-white dark:bg-black", className)}>
      {/* Page Header */}
      <div className={cn("bg-white dark:bg-black", headerClassName)}>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {item.href ? (
                          <BreadcrumbLink asChild>
                            <Link
                              href={item.href}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            >
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="text-gray-900 dark:text-gray-100">
                            {item.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="text-gray-400 dark:text-gray-600" />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            {(primaryAction || secondaryActions) && (
              <div className="mt-4 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                {primaryAction && <div>{primaryAction}</div>}
                {secondaryActions && secondaryActions.length > 0 && (
                  <div className="flex space-x-3">
                    {secondaryActions.map((action, index) => (
                      <div key={index}>{action}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main
        className={cn("flex-1 p-6 bg-white dark:bg-black", contentClassName)}
      >
        {children}
      </main>
    </div>
  );
}
