"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  HandHeart,
  DollarSign,
} from "lucide-react";
import { MetricsCardsProps } from "@/types";

export function MetricsCardsShadcn({ data, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "New Leads (7 hari)",
      value: data?.newLeads ?? 0,
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Leads",
      value: data?.totalLeads ?? 0,
      icon: UserCheck,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Deals Closed",
      value: data?.dealsClosed ?? 0,
      icon: HandHeart,
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Revenue",
      value: `$${data?.revenue ?? 0}`,
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1">
                <Badge
                  variant={metric.trendUp ? "default" : "destructive"}
                  className="text-xs"
                >
                  {metric.trendUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.trend}
                </Badge>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
