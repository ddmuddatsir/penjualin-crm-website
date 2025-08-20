// services/api.ts
// Base API service class

import { HTTP_STATUS, CONTENT_TYPES } from "@/constants";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }

  // Helper methods untuk cek tipe error
  isNetworkError(): boolean {
    return this.status === 0;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isValidationError(): boolean {
    return this.status === 422;
  }

  isTooManyRequests(): boolean {
    return this.status === 429;
  }

  getErrorMessage(): string {
    // Prioritas: pesan dari server, fallback ke status text, fallback ke generic message
    if (this.data && typeof this.data === "object" && "message" in this.data) {
      return String(this.data.message);
    }

    if (this.data && typeof this.data === "object" && "error" in this.data) {
      return String(this.data.error);
    }

    switch (this.status) {
      case 0:
        return "Koneksi jaringan bermasalah. Silakan cek internet Anda.";
      case 400:
        return "Permintaan tidak valid. Silakan cek data yang dikirim.";
      case 401:
        return "Sesi Anda telah berakhir. Silakan login ulang.";
      case 403:
        return "Anda tidak memiliki akses untuk melakukan tindakan ini.";
      case 404:
        return "Data yang diminta tidak ditemukan.";
      case 422:
        return "Data yang dikirim tidak valid. Silakan periksa kembali.";
      case 429:
        return "Terlalu banyak permintaan. Silakan coba lagi nanti.";
      case 500:
        return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      case 502:
        return "Server sedang bermasalah. Silakan coba lagi nanti.";
      case 503:
        return "Layanan sedang tidak tersedia. Silakan coba lagi nanti.";
      default:
        return this.statusText || "Terjadi kesalahan yang tidak diketahui.";
    }
  }
}

export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      [CONTENT_TYPES.JSON]: "application/json",
    };

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API ${config.method || "GET"} request:`, url);

      const response = await fetch(url, config);

      // Log response status
      console.log(
        `🌐 API response status:`,
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // Jika response bukan JSON, gunakan text
          try {
            errorData = { message: await response.text() };
          } catch {
            errorData = {
              message: `HTTP ${response.status}: ${response.statusText}`,
            };
          }
        }

        console.error(`❌ API Error ${response.status}:`, errorData);
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // Handle empty responses
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return {} as T;
      }

      const result = await response.json();
      console.log(`✅ API response data:`, result);
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      console.error("❌ Network/Fetch Error:", error);
      throw new ApiError(0, "Network Error", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🌐 API GET request:", `${this.baseURL}${url}`);
    }

    const result = await this.request<T>(url, {
      method: "GET",
    });

    if (process.env.NODE_ENV === "development") {
      console.log("🌐 API GET response:", result);
    }

    return result;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async downloadFile(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<Blob> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, response.statusText, errorData);
    }

    return response.blob();
  }
}

// Default API service instance
export const apiService = new ApiService();
