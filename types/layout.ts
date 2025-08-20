import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageLayoutProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export interface FilterLayoutProps {
  filters: React.ReactNode;
  content: React.ReactNode;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  filterTitle?: string;
  className?: string;
  filtersClassName?: string;
  contentClassName?: string;
  variant?: "top" | "sidebar" | "drawer";
}
