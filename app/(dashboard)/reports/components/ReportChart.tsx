import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COLOR_BLUE_600, COLOR_GREEN_500 } from "@/lib/colors";

interface ReportChartProps {
  data: Array<{ month: string; leads: number; deals: number }> | undefined;
}

export default function ReportChart({ data }: ReportChartProps) {
  return (
    <Card style={{ marginBottom: 32 }}>
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="deals" fill={COLOR_BLUE_600} name="Deals Closed" />
            <Bar dataKey="leads" fill={COLOR_GREEN_500} name="Leads" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
