"use client";

import { useQuery } from "@tanstack/react-query";
import { reports } from "@/services";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => reports.getDashboardData(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ["dashboard", "realtime"],
    queryFn: () => reports.getRealTimeMetrics(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useSalesPerformance = (startDate?: string, endDate?: string) => {
  // Provide default date range if not specified (last 30 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const start = startDate ? new Date(startDate) : defaultStartDate;
  const end = endDate ? new Date(endDate) : defaultEndDate;

  return useQuery({
    queryKey: ["dashboard", "sales", { startDate, endDate }],
    queryFn: () => reports.getSalesPerformance(start, end),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeadAnalytics = (startDate?: string, endDate?: string) => {
  // Provide default date range if not specified (last 30 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const start = startDate ? new Date(startDate) : defaultStartDate;
  const end = endDate ? new Date(endDate) : defaultEndDate;

  return useQuery({
    queryKey: ["dashboard", "leads", { startDate, endDate }],
    queryFn: () => reports.getLeadAnalytics(start, end),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useActivityAnalytics = (startDate?: string, endDate?: string) => {
  // Provide default date range if not specified (last 30 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const start = startDate ? new Date(startDate) : defaultStartDate;
  const end = endDate ? new Date(endDate) : defaultEndDate;

  return useQuery({
    queryKey: ["dashboard", "activities", { startDate, endDate }],
    queryFn: () => reports.getActivityAnalytics(start, end),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
