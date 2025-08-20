"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricsCardsProps } from "@/types";

export function MetricsCards({ data, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded" />
        ))}
      </div>
    );
  }

  // Extract metrics from Firebase structure
  const thisWeekLeads = data?.realTime?.thisWeekLeads ?? 0;
  const thisMonthDeals = data?.realTime?.thisMonthDeals ?? 0;
  const totalRevenue = data?.realTime?.totalRevenue ?? 0;
  const todayActivities = data?.realTime?.todayActivities ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            New Leads (7 hari)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {thisWeekLeads}
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Activities Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {todayActivities}
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Deals Closed (Bulan Ini)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {thisMonthDeals}
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Revenue (Bulan Ini)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Rp {totalRevenue?.toLocaleString("id-ID") ?? 0}
        </CardContent>
      </Card>
    </div>
  );
}
