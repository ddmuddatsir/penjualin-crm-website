"use client";

import { useState } from "react";
import { useReportsDashboard, useExportReport } from "@/hooks/useReports";
import { PageLayout } from "@/components/layouts";
import ReportFilters from "./components/ReportFilters";
import ReportMetrics from "./components/ReportMetrics";
import ReportChart from "./components/ReportChart";
import ReportTable from "./components/ReportTable";

export default function ReportsPage() {
  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState("2025-12-31");

  const { data, isLoading, error } = useReportsDashboard();
  const exportReport = useExportReport();

  const handleDownloadPDF = () => {
    if (!data) return;
    exportReport.mutate({ type: "pdf" });
  };

  const handleDownloadExcel = () => {
    if (!data) return;
    exportReport.mutate({ type: "excel" });
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout
        title="Reports"
        subtitle="Analisis dan laporan performa bisnis"
        description="Monitor statistik dan trends bisnis Anda"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Reports" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageLayout
        title="Reports"
        subtitle="Analisis dan laporan performa bisnis"
        description="Monitor statistik dan trends bisnis Anda"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Reports" },
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Error loading reports data</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Process data for display
  const totalLeads = data?.realTime?.thisWeekLeads || 0;
  const dealsClosed = data?.realTime?.thisMonthDeals || 0;
  const revenue = data?.realTime?.totalRevenue || 0;

  // Process lead status distribution for table
  const leadStatusData =
    data?.leadStatusDistribution?.map((item) => ({
      Status: item.status,
      Jumlah: item.count,
      Persentase: `${item.percentage.toFixed(1)}%`,
    })) || [];

  // Process monthly performance data by combining monthly leads and deals
  const monthlyPerformanceData =
    data?.monthlyDeals?.map((dealItem) => {
      const leadItem = data?.monthlyLeads?.find(
        (lead) => lead.month === dealItem.month
      );
      return {
        month: dealItem.month,
        deals: dealItem.count,
        leads: leadItem?.count || 0,
      };
    }) || [];

  // Process activities per user (mock data since we don't have user-specific activities)
  const activitiesPerUser = [
    { User: "Admin", "Jumlah Aktivitas": 25 },
    { User: "Sales Team", "Jumlah Aktivitas": 18 },
    { User: "Marketing", "Jumlah Aktivitas": 12 },
  ];

  // Process top performers (mock data since we don't track individual performance)
  const topPerformers = [
    { User: "Sales Rep 1", "Deals Closed": 8 },
    { User: "Sales Rep 2", "Deals Closed": 6 },
    { User: "Sales Rep 3", "Deals Closed": 4 },
  ];

  return (
    <PageLayout
      title="Reports"
      subtitle="Analisis dan laporan performa bisnis"
      description="Monitor statistik dan trends bisnis Anda"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Reports" },
      ]}
    >
      <div className="space-y-6">
        <ReportFilters
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          onDownloadPDF={handleDownloadPDF}
          onDownloadExcel={handleDownloadExcel}
          hasData={!!data}
        />
        <ReportMetrics data={{ totalLeads, dealsClosed, revenue }} />
        <ReportChart data={monthlyPerformanceData} />
        <ReportTable
          title="Aktivitas per User"
          headers={["User", "Jumlah Aktivitas"]}
          data={activitiesPerUser}
        />
        <ReportTable
          title="Distribusi Status Lead"
          headers={["Status", "Jumlah", "Persentase"]}
          data={leadStatusData}
          totalLeads={totalLeads}
        />
        <ReportTable
          title="Top Performers (Deals Closed)"
          headers={["User", "Deals Closed"]}
          data={topPerformers}
        />
      </div>
    </PageLayout>
  );
}
