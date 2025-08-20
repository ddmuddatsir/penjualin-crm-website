// hooks/useCreateActivity.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { activityService } from "@/services/firebase";

export interface CreateActivityData {
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK" | "OTHER";
  description: string;
  leadId?: string;
  dealId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export function useCreateActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateActivityData) => {
      const activityData = {
        type: data.type,
        description: data.description,
        leadId: data.leadId,
        dealId: data.dealId,
        userId: data.userId || "admin", // Default to admin if no user provided
        metadata: data.metadata || {},
      };

      return activityService.create(activityData);
    },
    onSuccess: (_, variables) => {
      // Invalidate activities for this lead
      queryClient.invalidateQueries({
        queryKey: ["lead-activities", variables.leadId],
      });

      // Also invalidate all activities
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      toast({
        title: "Success",
        description: "Activity berhasil ditambahkan",
      });
    },
    onError: (error) => {
      console.error("Error creating activity:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan activity",
        variant: "destructive",
      });
    },
  });
}
