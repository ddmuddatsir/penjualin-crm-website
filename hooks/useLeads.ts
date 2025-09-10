import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";
import type { FirestoreLead, ClientLead } from "@/types/firebase";

interface UseLeadsReturn {
  leads: ClientLead[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createLead: (
    data: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateLead: (
    id: string,
    data: Partial<Omit<ClientLead, "id" | "createdAt">>
  ) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  refetchLeads: () => void;
}

interface UseLeadsOptions {
  enabled?: boolean;
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const { enabled = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all leads
  const {
    data: leads = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      console.log("useLeads - Starting to fetch leads...");
      const result = await leadService.getAll();
      console.log("useLeads - Fetched leads:", result.length, result);
      return result;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount) => {
      console.log("useLeads - Retry attempt:", failureCount);
      return failureCount < 3;
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: (data: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt">) =>
      leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating lead:", error);
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<ClientLead, "id" | "createdAt">>;
    }) => leadService.update(id, data),
    onSuccess: () => {
      // Refetch data after successful update
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
    },
    onError: (err) => {
      console.error("Error updating lead:", err);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    },
  });

  const createLead = useCallback(
    async (data: Omit<FirestoreLead, "id" | "createdAt" | "updatedAt">) => {
      await createLeadMutation.mutateAsync(data);
    },
    [createLeadMutation]
  );

  const updateLead = useCallback(
    async (id: string, data: Partial<Omit<ClientLead, "id" | "createdAt">>) => {
      await updateLeadMutation.mutateAsync({ id, data });
    },
    [updateLeadMutation]
  );

  const deleteLead = useCallback(
    async (id: string) => {
      await deleteLeadMutation.mutateAsync(id);
    },
    [deleteLeadMutation]
  );

  const refetchLeads = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    leads,
    isLoading,
    isError,
    error,
    createLead,
    updateLead,
    deleteLead,
    refetchLeads,
  };
}
