"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  LEAD_STATUS_COLORS,
  CHART_COLORS,
  CHART_COLORS_DARK,
} from "@/lib/colors";

// Create chart colors array for easier indexing
const getChartColors = (isDark: boolean) =>
  Object.values(isDark ? CHART_COLORS_DARK : CHART_COLORS);

import { DashboardChartsProps } from "@/types";

export function DashboardCharts({ data, isLoading }: DashboardChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const chartColorsArray = getChartColors(isDark);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Leads per Hari Chart */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Leads Masuk per Hari
          </CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyLeads || []}>
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fill: "currentColor" }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "currentColor" }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={LEAD_STATUS_COLORS.OPEN}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Deals Closed per Bulan Chart */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Deals Closed per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyDeals || []}>
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tick={{ fill: "currentColor" }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "currentColor" }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={LEAD_STATUS_COLORS.CLOSED}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Distribusi Status Lead Chart */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Distribusi Status Lead
          </CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.leadStatusDistribution || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status }) => status}
                >
                  {(data?.leadStatusDistribution || []).map(
                    (entry: { status: string; count: number }, idx: number) => (
                      <Cell
                        key={entry.status}
                        fill={chartColorsArray[idx % chartColorsArray.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Conversion Rate Funnel Chart */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Conversion Rate Funnel
          </CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                  }}
                />
                <Funnel
                  dataKey="count"
                  data={data?.conversionFunnel || []}
                  isAnimationActive
                  fill={chartColorsArray[0]}
                >
                  <LabelList
                    dataKey="stage"
                    position="right"
                    style={{
                      fill: "currentColor",
                      fontSize: "12px",
                    }}
                    className="text-gray-900 dark:text-gray-100"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
