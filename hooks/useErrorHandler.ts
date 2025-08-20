// hooks/useErrorHandler.ts
// Custom hook for global error handling

import { useCallback } from "react";
import { useToast } from "./use-toast";
import { getErrorDisplayInfo, logError } from "@/lib/error-handler";

export interface UseErrorHandlerReturn {
  handleError: (error: unknown, context?: string) => void;
  handleErrorWithToast: (error: unknown, context?: string) => void;
  handleAsyncError: <T>(
    operation: () => Promise<T>,
    context?: string
  ) => Promise<{ data?: T; error?: unknown }>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    logError(error, context);
  }, []);

  const handleErrorWithToast = useCallback(
    (error: unknown, context?: string) => {
      logError(error, context);
      const errorInfo = getErrorDisplayInfo(error);

      toast({
        title: errorInfo.title,
        description: errorInfo.message,
        variant: errorInfo.variant,
      });

      // Handle action separately if needed
      if (errorInfo.action) {
        // Could implement a custom action button or modal here
        console.log("Action available:", errorInfo.action.label);
      }
    },
    [toast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      operation: () => Promise<T>,
      context?: string
    ): Promise<{ data?: T; error?: unknown }> => {
      try {
        const data = await operation();
        return { data };
      } catch (error) {
        handleErrorWithToast(error, context);
        return { error };
      }
    },
    [handleErrorWithToast]
  );

  return {
    handleError,
    handleErrorWithToast,
    handleAsyncError,
  };
};
