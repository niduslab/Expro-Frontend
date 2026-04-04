import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * API Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */

// Environment-based API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/**
 * Main Axios Instance
 * Configured with base URL, credentials, and default headers
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds
});

/**
 * CSRF Token Management
 * Fetches and caches CSRF token from Laravel Sanctum
 */
let csrfTokenPromise: Promise<void> | null = null;

const getCsrfToken = async (): Promise<void> => {
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Properly construct the base URL by removing /api/v1
  const baseURL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;

  csrfTokenPromise = axios
    .get(csrfUrl, {
      withCredentials: true,
    })
    .then(() => {
      csrfTokenPromise = null;
    })
    .catch((error) => {
      csrfTokenPromise = null;
      console.error("Failed to fetch CSRF token from:", csrfUrl, error);
      throw error;
    });

  return csrfTokenPromise;
};

/**
 * Request Interceptor
 * Automatically attaches authentication token and handles CSRF token
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get CSRF token for state-changing requests
    if (
      config.method &&
      ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())
    ) {
      try {
        await getCsrfToken();
      } catch (error) {
        console.error("CSRF token fetch failed:", error);
      }
    }

    // Attach auth token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      skipAuthRedirect?: boolean;
    };

    // Handle 419 CSRF Token Mismatch - Retry with fresh token
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Force fetch a new CSRF token
        csrfTokenPromise = null;
        await getCsrfToken();

        // Retry the original request
        return apiClient(originalRequest);
      } catch (csrfError) {
        console.error("Failed to refresh CSRF token:", csrfError);
        return Promise.reject(error);
      }
    }

    // Handle 401 Unauthorized - Token expired or invalid
    // Only redirect to login if not a public endpoint and not explicitly skipped
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRedirect
    ) {
      originalRequest._retry = true;

      const url = originalRequest.url || "";
      const isPublicEndpoint =
        url.includes("/public/") || url.includes("/contactmessage");

      // Only redirect if it's not a public endpoint and user has a token
      if (!isPublicEndpoint && typeof window !== "undefined") {
        const hasToken = localStorage.getItem("auth_token");
        if (hasToken) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
      }
    }

    // Handle 429 Rate Limiting
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    }

    return Promise.reject(error);
  },
);

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Generic API Request Handler
 * Provides type-safe wrapper around axios requests
 */
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config),
};

/**
 * Public API Request Handler
 * For public endpoints that should not redirect to login on 401
 */
export const publicApiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, {
      ...config,
      skipAuthRedirect: true,
    } as any),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, {
      ...config,
      skipAuthRedirect: true,
    } as any),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, {
      ...config,
      skipAuthRedirect: true,
    } as any),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, {
      ...config,
      skipAuthRedirect: true,
    } as any),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, {
      ...config,
      skipAuthRedirect: true,
    } as any),
};

/**
 * Authentication Utilities
 */
export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      // Also set as cookie for middleware access
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      // Also remove cookie
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  isAuthenticated: () => {
    return !!authUtils.getToken();
  },
};

export default apiClient;
