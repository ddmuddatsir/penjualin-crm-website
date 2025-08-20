import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportMetricsProps } from "@/types";

export default function ReportMetrics({ data }: ReportMetricsProps) {
  const conversionRate =
    data && data.totalLeads && data.totalLeads > 0 && data.dealsClosed
      ? Math.round((data.dealsClosed / data.totalLeads) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Leads</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {data?.totalLeads ?? 0}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Deals Closed</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {data?.dealsClosed ?? 0}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          Rp {(data?.revenue ?? 0).toLocaleString()}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {conversionRate}%
        </CardContent>
      </Card>
    </div>
  );
}
