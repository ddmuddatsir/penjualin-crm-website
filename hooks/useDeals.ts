// hooks/useDeals.ts
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { dealService } from "@/services/firebase";
import type { FirestoreDeal, ClientDeal } from "@/types/firebase";
import { getErrorDisplayInfo, logError } from "@/lib/error-handler";

export interface UseDealsOptions {
  enabled?: boolean;
}

export interface UseDealsReturn {
  deals: ClientDeal[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createDeal: (
    data: Omit<FirestoreDeal, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateDeal: (
    id: string,
    data: Partial<Omit<ClientDeal, "id" | "createdAt">>
  ) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  refetchDeals: () => void;
}

export function useDeals(options: UseDealsOptions = {}): UseDealsReturn {
  const { enabled = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: deals = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deals"],
    queryFn: () => dealService.getAll(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount) => {
      return failureCount < 3;
    },
  });

  const createDealMutation = useMutation({
    mutationFn: (data: Omit<FirestoreDeal, "id" | "createdAt" | "updatedAt">) =>
      dealService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Success",
        description: "Deal has been created successfully.",
      });
    },
    onError: (error) => {
      logError(error, "useDeals");
      const errorInfo = getErrorDisplayInfo(error);
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<ClientDeal, "id" | "createdAt">>;
    }) => dealService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Success",
        description: "Deal has been updated successfully.",
      });
    },
    onError: (error) => {
      logError(error, "useDeals");
      const errorInfo = getErrorDisplayInfo(error);
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: dealService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({
        title: "Success",
        description: "Deal has been deleted successfully.",
      });
    },
    onError: (error) => {
      logError(error, "useDeals");
      const errorInfo = getErrorDisplayInfo(error);
      toast({
        title: "Error",
        description: errorInfo.message,
        variant: "destructive",
      });
    },
  });

  const createDeal = useCallback(
    async (data: Omit<FirestoreDeal, "id" | "createdAt" | "updatedAt">) => {
      await createDealMutation.mutateAsync(data);
    },
    [createDealMutation]
  );

  const updateDeal = useCallback(
    async (id: string, data: Partial<Omit<ClientDeal, "id" | "createdAt">>) => {
      await updateDealMutation.mutateAsync({ id, data });
    },
    [updateDealMutation]
  );

  const deleteDeal = useCallback(
    async (id: string) => {
      await deleteDealMutation.mutateAsync(id);
    },
    [deleteDealMutation]
  );

  const refetchDeals = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    deals,
    isLoading,
    isError,
    error: error as Error | null,
    createDeal,
    updateDeal,
    deleteDeal,
    refetchDeals,
  };
}
