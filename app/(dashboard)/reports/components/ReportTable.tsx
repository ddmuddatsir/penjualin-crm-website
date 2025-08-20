import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportTableProps } from "@/types";

export default function ReportTable({
  title,
  headers,
  data,
  totalLeads,
}: ReportTableProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="text-left py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, valueIndex) => (
                  <td key={valueIndex} className="py-2">
                    {valueIndex === 2 && totalLeads && typeof value === "number"
                      ? `${Math.round((value / totalLeads) * 100)}%`
                      : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
