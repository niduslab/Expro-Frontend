import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// ---------------------------
// Axios client
// ---------------------------
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // IMPORTANT: Enable credentials for cookie-based auth
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000, // 10 seconds
});

// ---------------------------
// Entity configuration
// ---------------------------
const entityConfig = ["donation"] as const;
export type Entity = (typeof entityConfig)[number];

// ---------------------------
// Generic queryKeys generator
// ---------------------------
export const queryKeys: Record<Entity, (id?: number) => readonly unknown[]> =
  entityConfig.reduce(
    (acc, entity) => {
      acc[entity] = (id?: number) =>
        id !== undefined ? ([entity, id] as const) : ([entity] as const);
      return acc;
    },
    {} as Record<Entity, (id?: number) => readonly unknown[]>,
  );

// ---------------------------
// QueryClient instance
// ---------------------------
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  },
});
// ---------------------------
// Generic invalidate helper
// ---------------------------
export const invalidateQueries = (entity: Entity, id?: number) =>
  queryClient.invalidateQueries({ queryKey: queryKeys[entity](id) });
