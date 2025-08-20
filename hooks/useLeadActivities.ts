// hooks/useLeadActivities.ts
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/firebase";

export function useLeadActivities(leadId: string | null) {
  return useQuery({
    queryKey: ["lead-activities", leadId],
    queryFn: async () => {
      if (!leadId) return [];

      // Get all activities and filter by leadId
      const allActivities = await activityService.getAll();
      return allActivities.filter((activity) => activity.leadId === leadId);
    },
    enabled: !!leadId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
