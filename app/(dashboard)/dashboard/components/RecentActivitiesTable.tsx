"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { RecentActivitiesTableProps } from "@/types";

export function RecentActivitiesTable({
  activities,
}: RecentActivitiesTableProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          5 Aktivitas Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Info Lead/Deal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((act) => (
              <TableRow key={act.id}>
                <TableCell>{act.description}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {act.type}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(act.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {act.relatedInfo ? (
                    <div className="text-sm">
                      <div className="font-medium">{act.relatedInfo.name}</div>
                      {act.relatedInfo.type === "Lead" && (
                        <>
                          {act.relatedInfo.company && (
                            <div className="text-xs text-gray-500">
                              {act.relatedInfo.company}
                            </div>
                          )}
                          {act.relatedInfo.email && (
                            <div className="text-xs text-gray-500">
                              {act.relatedInfo.email}
                            </div>
                          )}
                          <span
                            className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              act.relatedInfo.status === "OPEN"
                                ? "bg-yellow-100 text-yellow-800"
                                : act.relatedInfo.status === "CONTACTED"
                                ? "bg-blue-100 text-blue-800"
                                : act.relatedInfo.status === "PROPOSAL"
                                ? "bg-purple-100 text-purple-800"
                                : act.relatedInfo.status === "CLOSED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {act.relatedInfo.status}
                          </span>
                        </>
                      )}
                      {act.relatedInfo.type === "Deal" && (
                        <>
                          {act.relatedInfo.value && (
                            <div className="text-xs text-gray-500">
                              Rp {act.relatedInfo.value.toLocaleString()}
                            </div>
                          )}
                          <span
                            className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              act.relatedInfo.stage === "PROSPECTING"
                                ? "bg-yellow-100 text-yellow-800"
                                : act.relatedInfo.stage === "QUALIFICATION"
                                ? "bg-blue-100 text-blue-800"
                                : act.relatedInfo.stage === "PROPOSAL"
                                ? "bg-purple-100 text-purple-800"
                                : act.relatedInfo.stage === "NEGOTIATION"
                                ? "bg-orange-100 text-orange-800"
                                : act.relatedInfo.stage === "CLOSED_WON"
                                ? "bg-green-100 text-green-800"
                                : act.relatedInfo.stage === "CLOSED_LOST"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {act.relatedInfo.stage}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
