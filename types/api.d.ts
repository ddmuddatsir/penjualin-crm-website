/**
 * API Types for CRM SaaS Application
 */

import type { Lead, Deal, Activity, User } from "./models";

// Generic API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | number | undefined;
}

// Data Types for CRUD Operations
export interface CreateLeadData {
  name: string;
  company: string;
  email: string;
  status: "OPEN" | "CONTACTED" | "PROPOSAL" | "CLOSED";
  assignedToId?: string;
}

export type UpdateLeadData = Partial<CreateLeadData>;

export interface CreateDealData {
  leadId: string;
  dealValue: number;
  status: DealStatus;
  stage?: string;
  closedAt?: string | null;
  notes?: string;
  assignedToId?: string;
}

export type UpdateDealData = Partial<CreateDealData>;

export interface CreateActivityData {
  type: "EMAIL" | "CALL" | "MEETING" | "TASK" | "OTHER";
  title: string;
  description?: string;
  leadId?: string;
  dealId?: string;
  assignedToId?: string;
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
}

export type UpdateActivityData = Partial<CreateActivityData>;

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "SALES_REP";
  status?: string;
  department?: string;
  phone?: string;
  avatar?: string;
}

export type UpdateUserData = Partial<CreateUserData>;

// Response Types
export type LeadsResponse = PaginatedResponse<Lead>;
export type DealsResponse = PaginatedResponse<Deal>;
export type ActivitiesResponse = PaginatedResponse<Activity>;
export type UsersResponse = PaginatedResponse<User>;

export interface BulkDeleteResponse {
  count: number;
  deletedIds: string[];
}

// Report Specific Types
export interface ReportFiltersProps {
  start: string;
  setStart: (date: string) => void;
  end: string;
  setEnd: (date: string) => void;
  onDownloadPDF: () => void;
  onDownloadExcel: () => void;
  hasData: boolean;
}

export interface ReportTableProps {
  title: string;
  headers: string[];
  data: Array<Record<string, string | number>>;
  totalLeads?: number;
}

// Separate interface for dashboard activities (with nested objects)
export interface DashboardActivity {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
  lead: { name: string };
  user: { name: string };
}

// Flattened activity for table display
export interface ActivityTableData extends Record<string, string | number> {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
  leadName: string;
  userName: string;
}

export interface ReportData {
  totalLeads: number;
  dealsClosed: number;
  revenue: number;
  monthly: Array<{ month: string; leads: number; deals: number }>;
  activities: Array<{ user: string; count: number }>;
  leadStatusDistribution: Array<{ status: string; count: number }>;
  topPerformers: Array<{ user: string; deals: number }>;
}

export interface ReportMetricsProps {
  data:
    | {
        totalLeads?: number;
        dealsClosed?: number;
        revenue?: number;
      }
    | undefined;
}

// Report Filters
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  leadStatus?: string;
  dealStatus?: string;
  activityType?: string;
  start?: string;
  end?: string;
  type?: string;
  [key: string]: string | undefined;
}
