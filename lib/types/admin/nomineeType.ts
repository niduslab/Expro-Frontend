export interface Nominee {
  id: number;
  user_id: number;
  nominee_name_bangla: string;
  nominee_name_english: string;
  nominee_date_of_birth: string; // ISO 8601 date string
  relation: string;
  percentage: string; // Kept as string based on input "100.00", can be number if parsed
  nominee_photo: string | null;
  nominee_nid_number: string | null;
  nominee_mobile: string | null;
  address: string | null;
  is_primary: boolean;
  is_active: boolean;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  deleted_at: string | null; // ISO 8601 date string or null if not soft-deleted
}

// If you need the wrapper object containing the array:
export interface NomineeResponse {
  nominee: Nominee[];
}
