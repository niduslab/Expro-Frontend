// /**
//  * Legacy BaseApi Configuration
//  *
//  * This file has been moved from app/tanstack/api/BaseApi.ts to lib/api/BaseApi.ts
//  *
//  * RECOMMENDED: Use the new enhanced API structure:
//  * - lib/api/axios.ts for axios configuration
//  * - lib/hooks/* for React Query hooks
//  *
//  * This file is maintained for backward compatibility.
//  */

// import axios from "axios";
// import { QueryClient } from "@tanstack/react-query";

// // ---------------------------
// // Axios client
// // ---------------------------
// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
//   withCredentials: true, // IMPORTANT: Enable credentials for cookie-based auth
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json"
//   },
//   timeout: 30000, // 30 seconds
// });

// // Request interceptor for auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('auth_token');
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ---------------------------
// // Entity configuration
// // ---------------------------
// const entityConfig = [
//   "donation",
//   "membership-application",
//   "profile",
//   "wallet",
//   "branch",
// ] as const;

// export type Entity = (typeof entityConfig)[number];

// // ---------------------------
// // Generic queryKeys generator
// // ---------------------------
// export const queryKeys: Record<Entity, (id?: number) => readonly unknown[]> =
//   entityConfig.reduce(
//     (acc, entity) => {
//       acc[entity] = (id?: number) =>
//         id !== undefined ? ([entity, id] as const) : ([entity] as const);
//       return acc;
//     },
//     {} as Record<Entity, (id?: number) => readonly unknown[]>,
//   );

// // ---------------------------
// // QueryClient instance
// // ---------------------------
// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       refetchOnWindowFocus: true,
//       retry: 2,
//     },
//     mutations: {
//       retry: 1,
//     },
//   },
// });

// // ---------------------------
// // Generic invalidate helper
// // ---------------------------
// export const invalidateQueries = (entity: Entity, id?: number) =>
//   queryClient.invalidateQueries({ queryKey: queryKeys[entity](id) });
