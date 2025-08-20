/**
 * Component Props Types for CRM SaaS Application
 */

import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { DragEndEvent } from "@dnd-kit/core";
import type {
  User,
  Lead,
  Deal,
  Activity,
  ActivityForm,
  LeadFilters,
  DashboardActivityType,
  LeadType,
  PasswordFormValues,
  EditRole,
} from "./models";

// Navigation Components
export interface NavigationBarProps {
  isAuthenticated: boolean;
  userName?: string | null;
  onGoToDashboard: () => void;
  onLogout: () => void;
}

// Home Components
export interface HeroSectionProps {
  isAuthenticated: boolean;
  onGoToDashboard: () => void;
}

// Auth Components
export interface AuthGuardProps {
  children: ReactNode;
}

// Activity Components
export interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ActivityForm;
  setForm: (form: ActivityForm) => void;
  leads: Lead[];
  users: User[];
  selectedDate: Date;
  onSubmit: (data: ActivityForm & { date: string }) => void;
  isPending: boolean;
}

export interface ActivityFiltersProps {
  filterType: string;
  setFilterType: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

export interface ActivityDetailDialogProps {
  activity: Activity | null;
  onOpenChange: (open: boolean) => void;
}

export interface ActivityTableProps {
  activities: Activity[];
  isLoading: boolean;
  selectedDate: Date;
}

// Dashboard Components
export interface DashboardChartsProps {
  data: {
    // Updated to match Firebase structure
    dailyLeads?: Array<{ date: string; count: number }>;
    monthlyDeals?: Array<{ month: string; count: number }>;
    leadStatusDistribution?: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    conversionFunnel?: Array<{ stage: string; count: number; rate: number }>;
    // Legacy structure for compatibility
    leadsPerHari?: Array<{ tanggal: string; jumlahLeads: number }>;
    dealsClosedPerBulan?: Array<{ bulan: string; totalNilaiDeals: number }>;
    distribusiStatusLead?: Array<{ status: string; jumlah: number }>;
    funnel?: Array<{ tahap: string; jumlah: number }>;
  };
  isLoading: boolean;
}

export interface MetricsCardsProps {
  data:
    | {
        realTime?: {
          todayActivities: number;
          thisWeekLeads: number;
          thisMonthDeals: number;
          totalRevenue: number;
          lastUpdated: string;
        };
        // Legacy properties for backward compatibility
        totalLeads?: number;
        dealsClosed?: number;
        newLeads?: number;
        revenue?: number;
      }
    | undefined;
  isLoading: boolean;
}

export interface RecentActivitiesTableProps {
  activities: DashboardActivityType[];
}

export interface RecentLeadsTableProps {
  leads: LeadType[];
}

// Deal Components
export interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<Deal>;
  leads: Lead[];
  isEdit: boolean;
  isPending: boolean;
  onSubmit: (data: Deal) => void;
}

export interface DealFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  onAdd: () => void;
}

export interface DealTableProps {
  deals: Deal[];
  isLoading: boolean;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

// Lead Components
export interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<Lead>;
  users: User[];
  isEdit: boolean;
  isPending: boolean;
  onSubmit: (data: Lead) => void;
}

export interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export interface LeadFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  onAdd: () => void;
}

// Pipeline Components
export interface SortableLeadProps {
  lead: Lead;
  setActiveLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  status: string;
}

export interface PipelineColumnProps {
  status: string;
  statusLabel: string;
  statusColor: { bg: string; border: string; text: string };
  leads: Lead[];
  onAdd: () => void;
  children: ReactNode;
}

export interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newLead: { name: string; company: string; email: string };
  setNewLead: (lead: { name: string; company: string; email: string }) => void;
  onSubmit: () => void;
  isPending: boolean;
  statusLabel?: string;
}

export interface PipelineFiltersProps {
  filters: {
    q: string;
    status: string;
    owner: string;
    date: string;
  };
  setFilters: (f: (prev: LeadFilters) => LeadFilters) => void;
  statuses: string[];
  statusLabels: Record<string, string>;
}

export interface PipelineBoardProps {
  statuses: string[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, { bg: string; border: string; text: string }>;
  groupedColumns: Record<string, Lead[]>;
  isLoading: boolean;
  onAddLead: (status: string) => void;
  setActiveLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  onDragEnd: (event: DragEndEvent) => void;
}

// Report Components
export interface ReportChartProps {
  data: Array<{ month: string; leads: number; deals: number }> | undefined;
}

// Settings Components
export interface ProfileFormProps {
  form: UseFormReturn<{ name: string; email: string }>;
  onSubmit: () => void;
}

export interface PasswordFormProps {
  form: UseFormReturn<PasswordFormValues>;
  onSubmit: () => void;
}

export interface RoleManagementTableProps {
  users: User[];
  editRole: EditRole | null;
  setEditRole: (role: EditRole | null) => void;
  roleMutation: { mutate: (role: EditRole) => void };
}
