import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportData } from "@/types";

export const downloadPDF = (data: ReportData, start: string, end: string) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("PenjualinCRM - Sales Report", 20, 20);

  // Date range
  doc.setFontSize(12);
  doc.text(`Period: ${start} to ${end}`, 20, 30);

  // Summary metrics
  doc.setFontSize(14);
  doc.text("Summary Metrics", 20, 45);
  doc.setFontSize(10);
  doc.text(`Total Leads: ${data.totalLeads}`, 20, 55);
  doc.text(`Deals Closed: ${data.dealsClosed}`, 20, 65);
  doc.text(`Revenue: Rp ${data.revenue?.toLocaleString() || 0}`, 20, 75);
  doc.text(
    `Conversion Rate: ${
      data.totalLeads > 0
        ? Math.round((data.dealsClosed / data.totalLeads) * 100)
        : 0
    }%`,
    20,
    85
  );

  // Monthly Performance Table
  autoTable(doc, {
    startY: 100,
    head: [["Month", "Leads", "Deals Closed"]],
    body:
      data.monthly?.map((item) => [item.month, item.leads, item.deals]) || [],
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Activities per User Table
  autoTable(doc, {
    startY: 160,
    head: [["User", "Activities Count"]],
    body: data.activities?.map((item) => [item.user, item.count]) || [],
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Lead Status Distribution Table
  autoTable(doc, {
    startY: 220,
    head: [["Status", "Count", "Percentage"]],
    body:
      data.leadStatusDistribution?.map((item) => [
        item.status,
        item.count,
        `${
          data.totalLeads > 0
            ? Math.round((item.count / data.totalLeads) * 100)
            : 0
        }%`,
      ]) || [],
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Top Performers Table
  autoTable(doc, {
    startY: 280,
    head: [["User", "Deals Closed"]],
    body: data.topPerformers?.map((item) => [item.user, item.deals]) || [],
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Save PDF
  doc.save(`penjualin-crm-report-${start}-to-${end}.pdf`);
};

export const downloadExcel = (data: ReportData, start: string, end: string) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["PenjualinCRM - Sales Report"],
    [""],
    ["Period", `${start} to ${end}`],
    [""],
    ["Summary Metrics"],
    ["Total Leads", data.totalLeads],
    ["Deals Closed", data.dealsClosed],
    ["Revenue", data.revenue || 0],
    [
      "Conversion Rate",
      `${
        data.totalLeads > 0
          ? Math.round((data.dealsClosed / data.totalLeads) * 100)
          : 0
      }%`,
    ],
    [""],
    ["Monthly Performance"],
    ["Month", "Leads", "Deals Closed"],
    ...(data.monthly?.map((item) => [item.month, item.leads, item.deals]) ||
      []),
    [""],
    ["Activities per User"],
    ["User", "Activities Count"],
    ...(data.activities?.map((item) => [item.user, item.count]) || []),
    [""],
    ["Lead Status Distribution"],
    ["Status", "Count", "Percentage"],
    ...(data.leadStatusDistribution?.map((item) => [
      item.status,
      item.count,
      `${
        data.totalLeads > 0
          ? Math.round((item.count / data.totalLeads) * 100)
          : 0
      }%`,
    ]) || []),
    [""],
    ["Top Performers"],
    ["User", "Deals Closed"],
    ...(data.topPerformers?.map((item) => [item.user, item.deals]) || []),
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  // Monthly Performance sheet
  const monthlyData = [
    ["Month", "Leads", "Deals Closed"],
    ...(data.monthly?.map((item) => [item.month, item.leads, item.deals]) ||
      []),
  ];
  const monthlyWs = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(wb, monthlyWs, "Monthly Performance");

  // Activities sheet
  const activitiesData = [
    ["User", "Activities Count"],
    ...(data.activities?.map((item) => [item.user, item.count]) || []),
  ];
  const activitiesWs = XLSX.utils.aoa_to_sheet(activitiesData);
  XLSX.utils.book_append_sheet(wb, activitiesWs, "Activities");

  // Lead Status sheet
  const statusData = [
    ["Status", "Count", "Percentage"],
    ...(data.leadStatusDistribution?.map((item) => [
      item.status,
      item.count,
      `${
        data.totalLeads > 0
          ? Math.round((item.count / data.totalLeads) * 100)
          : 0
      }%`,
    ]) || []),
  ];
  const statusWs = XLSX.utils.aoa_to_sheet(statusData);
  XLSX.utils.book_append_sheet(wb, statusWs, "Lead Status");

  // Top Performers sheet
  const performersData = [
    ["User", "Deals Closed"],
    ...(data.topPerformers?.map((item) => [item.user, item.deals]) || []),
  ];
  const performersWs = XLSX.utils.aoa_to_sheet(performersData);
  XLSX.utils.book_append_sheet(wb, performersWs, "Top Performers");

  // Save Excel file
  XLSX.writeFile(wb, `penjualin-crm-report-${start}-to-${end}.xlsx`);
};
