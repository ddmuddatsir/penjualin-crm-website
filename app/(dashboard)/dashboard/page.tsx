"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { MetricsCards } from "./components/MetricsCards";
import { DashboardCharts } from "./components/DashboardCharts";
import { RecentLeadsTable } from "./components/RecentLeadsTable";
import { RecentActivitiesTable } from "./components/RecentActivitiesTable";
import { PageLayout } from "@/components/layouts";
import type { LeadType, DashboardActivityType } from "@/types/models";
import type { ClientLead, ClientActivity } from "@/types/firebase";

// Extended type for activities with related info
type ActivityWithRelatedInfo = ClientActivity & {
  relatedInfo?: {
    type: "Lead" | "Deal";
    name: string;
    company?: string;
    email?: string;
    status?: string;
    value?: number;
    stage?: string;
  } | null;
};

// Helper functions untuk konversi tipe
const convertFirebaseLeadToLeadType = (lead: ClientLead): LeadType => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  status: lead.status,
  assignedTo: lead.assignedTo
    ? {
        id: lead.assignedTo,
        name: lead.assignedTo, // Assuming assignedTo is username/name
        email: "", // Default empty email since Firebase only stores username
      }
    : undefined,
  createdAt:
    lead.createdAt instanceof Date
      ? lead.createdAt.toISOString()
      : new Date(lead.createdAt).toISOString(),
});

const convertFirebaseActivityToDashboardActivity = (
  activity: ActivityWithRelatedInfo
): DashboardActivityType => ({
  id: activity.id,
  type: activity.type,
  description: activity.description || "",
  leadId: activity.leadId,
  dealId: activity.dealId,
  userId: activity.userId,
  metadata: activity.metadata,
  relatedInfo: activity.relatedInfo || null,
  createdAt:
    activity.createdAt instanceof Date
      ? activity.createdAt
      : new Date(activity.createdAt),
  updatedAt:
    activity.updatedAt instanceof Date
      ? activity.updatedAt
      : new Date(activity.updatedAt),
});

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  // Convert Firebase data to expected types
  const convertedLeads =
    data?.leadsTerbaru?.map(convertFirebaseLeadToLeadType) || [];
  const convertedActivities =
    data?.activitiesTerakhir?.map((activity) =>
      convertFirebaseActivityToDashboardActivity(
        activity as ActivityWithRelatedInfo
      )
    ) || [];

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Selamat datang, ${
        user?.displayName || user?.email || "User"
      }!`}
      description="Pantau performa bisnis Anda dalam satu tempat"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <MetricsCards data={data} isLoading={isLoading} />

        {/* Charts */}
        <DashboardCharts data={data || {}} isLoading={isLoading} />

        {/* Recent Leads Table */}
        <RecentLeadsTable leads={convertedLeads} />

        {/* Recent Activities Table */}
        <RecentActivitiesTable activities={convertedActivities} />
      </div>
    </PageLayout>
  );
}
