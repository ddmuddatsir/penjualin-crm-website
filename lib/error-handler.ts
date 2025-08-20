// lib/error-handler.ts
// Utility functions for handling errors throughout the application

import { ApiError } from "@/services/api";

export interface ErrorDisplayInfo {
  title: string;
  message: string;
  variant: "default" | "destructive";
  action?: {
    label: string;
    handler: () => void;
  };
}

/**
 * Converts any error to a user-friendly display format
 */
export function getErrorDisplayInfo(error: unknown): ErrorDisplayInfo {
  console.error("🚨 Error occurred:", error);

  // Handle ApiError
  if (error instanceof ApiError) {
    const baseInfo: ErrorDisplayInfo = {
      title: getErrorTitle(error),
      message: error.getErrorMessage(),
      variant: "destructive",
    };

    // Add specific actions based on error type
    if (error.isUnauthorized()) {
      baseInfo.action = {
        label: "Login Ulang",
        handler: () => {
          window.location.href = "/login";
        },
      };
    } else if (error.isNetworkError()) {
      baseInfo.action = {
        label: "Coba Lagi",
        handler: () => {
          window.location.reload();
        },
      };
    }

    return baseInfo;
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      title: "Terjadi Kesalahan",
      message: error.message || "Terjadi kesalahan yang tidak diketahui",
      variant: "destructive",
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      title: "Terjadi Kesalahan",
      message: error,
      variant: "destructive",
    };
  }

  // Handle unknown errors
  return {
    title: "Terjadi Kesalahan",
    message: "Terjadi kesalahan yang tidak diketahui",
    variant: "destructive",
  };
}

/**
 * Get appropriate error title based on error type
 */
function getErrorTitle(error: ApiError): string {
  if (error.isUnauthorized()) {
    return "Sesi Berakhir";
  }

  if (error.isForbidden()) {
    return "Akses Ditolak";
  }

  if (error.isNotFound()) {
    return "Data Tidak Ditemukan";
  }

  if (error.isValidationError()) {
    return "Data Tidak Valid";
  }

  if (error.isTooManyRequests()) {
    return "Terlalu Banyak Permintaan";
  }

  if (error.isServerError()) {
    return "Kesalahan Server";
  }

  if (error.isNetworkError()) {
    return "Koneksi Bermasalah";
  }

  if (error.isClientError()) {
    return "Permintaan Tidak Valid";
  }

  return "Terjadi Kesalahan";
}

/**
 * Log error with context information
 */
export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString();
  const errorContext = context ? ` [${context}]` : "";

  console.group(`🚨 Error${errorContext} - ${timestamp}`);

  if (error instanceof ApiError) {
    console.error("API Error Details:", {
      status: error.status,
      statusText: error.statusText,
      data: error.data,
      message: error.getErrorMessage(),
    });
  } else if (error instanceof Error) {
    console.error("Error Details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error("Unknown Error:", error);
  }

  console.groupEnd();
}

/**
 * Handle async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: unknown }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    logError(error, context);
    return { error };
  }
}

/**
 * Retry mechanism for failed operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry for client errors (4xx) except 429 (rate limit)
      if (
        error instanceof ApiError &&
        error.isClientError() &&
        !error.isTooManyRequests()
      ) {
        throw error;
      }

      if (attempt < maxRetries) {
        console.log(`⏳ Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}
