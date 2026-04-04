// ─── Enums ──────────────────────────────────────────────────────
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

// ─── Core Entity ────────────────────────────────────────────────
export interface Event {
  id: number;
  project_id: number | null;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  status: EventStatus;
  max_attendees: number | null;
  registration_fee: number;
  image: string | null;
  metadata: Record<string, unknown> | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

// ─── Payload ─────────────────────────────────────────────────────
export interface EventPayload {
  project_id?: number | null;
  title: string;
  description?: string | null;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  status: EventStatus;
  max_attendees?: number | null;
  registration_fee?: number | null;
  image?: string | null;
  metadata?: string | null; // JSON string as per validation
}

// ─── Query Params ─────────────────────────────────────────────────
export interface EventQueryParams {
  project_id?: number;
  title?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status?: EventStatus;
  max_attendees?: number;
  registration_fee?: number;
  q?: string;
  sort_by?: keyof Event;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

// ─── Responses ────────────────────────────────────────────────────
export interface EventListResponse {
  success: boolean;
  message: string;
  data: Event[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SingleEventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface DeleteEventResponse {
  success: boolean;
  message: string;
}
