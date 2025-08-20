import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface CrudConfig<T = Record<string, unknown>> {
  // API endpoints
  baseUrl: string;

  // Query keys
  queryKey: string[];

  // Default values for forms
  defaultValues?: Partial<T>;

  // Success messages
  messages?: {
    create?: string;
    update?: string;
    delete?: string;
  };

  // Error handling
  onError?: (error: Error, operation: string) => void;

  // Data transformation
  transformResponse?: (data: unknown) => T[];
  transformItem?: (data: unknown) => T;
}

export interface UseCrudResult<T = Record<string, unknown>> {
  // Data state
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // CRUD operations
  create: (item: Partial<T>) => Promise<T>;
  update: (id: string, item: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;

  // Operation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Utility functions
  refetch: () => void;
  invalidate: () => void;
}

/**
 * Generic CRUD hook
 * Provides standardized data management operations
 */
export function useCrud<T = Record<string, unknown>>(
  config: CrudConfig<T>
): UseCrudResult<T> {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    baseUrl,
    queryKey,
    defaultValues = {},
    messages = {},
    onError,
    transformResponse,
    transformItem,
  } = config;

  // Fetch data
  const {
    data: rawData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      return transformResponse ? transformResponse(data) : data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (item: Partial<T>) => {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...defaultValues, ...item }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create item: ${response.statusText}`);
      }

      const data = await response.json();
      return transformItem ? transformItem(data) : data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (messages.create) {
        toast({ title: "Success", description: messages.create });
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error, "create");
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, item }: { id: string; item: Partial<T> }) => {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
      }

      const data = await response.json();
      return transformItem ? transformItem(data) : data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (messages.update) {
        toast({ title: "Success", description: messages.update });
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error, "update");
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      if (messages.delete) {
        toast({ title: "Success", description: messages.delete });
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error, "delete");
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Wrapper functions
  const create = useCallback(
    (item: Partial<T>) => createMutation.mutateAsync(item),
    [createMutation]
  );

  const update = useCallback(
    (id: string, item: Partial<T>) => updateMutation.mutateAsync({ id, item }),
    [updateMutation]
  );

  const remove = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    [deleteMutation]
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    // Data state
    data: rawData,
    isLoading,
    isError,
    error: error as Error | null,

    // CRUD operations
    create,
    update,
    remove,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Utility functions
    refetch,
    invalidate,
  };
}

/**
 * Hook for managing form state with CRUD operations
 */
export function useCrudForm<T = Record<string, unknown>>(
  config: CrudConfig<T>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>(
    config.defaultValues || {}
  );

  const crud = useCrud(config);

  const openCreate = useCallback(() => {
    setEditItem(null);
    setFormData(config.defaultValues || {});
    setIsOpen(true);
  }, [config.defaultValues]);

  const openEdit = useCallback((item: T) => {
    setEditItem(item);
    setFormData(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditItem(null);
    setFormData(config.defaultValues || {});
  }, [config.defaultValues]);

  const handleSubmit = useCallback(async () => {
    try {
      if (editItem && typeof editItem === "object" && "id" in editItem) {
        await crud.update(String(editItem.id), formData);
      } else {
        await crud.create(formData);
      }
      close();
    } catch {
      // Error handling is done in the crud hook
    }
  }, [editItem, formData, crud, close]);

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    ...crud,

    // Form state
    isOpen,
    editItem,
    formData,
    isEditing: !!editItem,

    // Form actions
    openCreate,
    openEdit,
    close,
    handleSubmit,
    updateField,

    // Combined loading state
    isSubmitting: crud.isCreating || crud.isUpdating,
  };
}
