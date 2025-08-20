"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { reports } from "@/services";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => reports.getReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useReportsDashboard = () => {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => reports.getDashboardData(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeadsReport = () => {
  return useQuery({
    queryKey: ["reports", "leads"],
    queryFn: () => reports.getLeadsReport(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useDealsReport = () => {
  return useQuery({
    queryKey: ["reports", "deals"],
    queryFn: () => reports.getDealsReport(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useActivitiesReport = () => {
  return useQuery({
    queryKey: ["reports", "activities"],
    queryFn: () => reports.getActivitiesReport(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useRevenueReport = () => {
  return useQuery({
    queryKey: ["reports", "revenue"],
    queryFn: () => reports.getRevenueReport(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: ({ type }: { type: string }) => reports.exportReport(type),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to export report",
        variant: "destructive",
      });
    },
  });
};
