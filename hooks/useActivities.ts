// hooks/useActivities.ts
// Custom hook for activity management with Firebase

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { activityService } from "@/services/firebase";
import type { ClientActivity } from "@/types/firebase";

export interface UseActivitiesOptions {
  enabled?: boolean;
}

export interface UseActivitiesReturn {
  // Data
  activities: ClientActivity[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Actions
  createActivity: (
    data: Omit<ClientActivity, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateActivity: (
    id: string,
    data: Partial<Omit<ClientActivity, "id" | "createdAt">>
  ) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  refetchActivities: () => void;
}

export function useActivities(
  options: UseActivitiesOptions = {}
): UseActivitiesReturn {
  const { enabled = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for fetching activities
  const {
    data: activities = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => activityService.getAll(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.error("Error fetching activities:", error);
      return failureCount < 3;
    },
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: (
      data: Omit<ClientActivity, "id" | "createdAt" | "updatedAt">
    ) => activityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Activity Created",
        description: "Activity has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create activity.",
        variant: "destructive",
      });
    },
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<ClientActivity, "id" | "createdAt">>;
    }) => activityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Activity Updated",
        description: "Activity has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity.",
        variant: "destructive",
      });
    },
  });

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: activityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Activity Deleted",
        description: "Activity has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete activity.",
        variant: "destructive",
      });
    },
  });

  // Memoized functions
  const createActivity = useCallback(
    async (data: Omit<ClientActivity, "id" | "createdAt" | "updatedAt">) => {
      await createActivityMutation.mutateAsync(data);
    },
    [createActivityMutation]
  );

  const updateActivity = useCallback(
    async (
      id: string,
      data: Partial<Omit<ClientActivity, "id" | "createdAt">>
    ) => {
      await updateActivityMutation.mutateAsync({ id, data });
    },
    [updateActivityMutation]
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      await deleteActivityMutation.mutateAsync(id);
    },
    [deleteActivityMutation]
  );

  const refetchActivities = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Data
    activities,
    isLoading,
    isError,
    error,

    // Actions
    createActivity,
    updateActivity,
    deleteActivity,
    refetchActivities,
  };
}
