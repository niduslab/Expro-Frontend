export interface Branch {
  id: number;
  code: string;
  name: string;
  name_bangla?: string | null;
  district?: string | null;
  division?: string | null;
  address?: string | null;
  contact_number?: string | null;
  email?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BranchListResponse {
  success: boolean;
  message: string;
  data: Branch[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SingleBranchResponse {
  success: boolean;
  message: string;
  user: Branch; // backend returns "user" key (matches your controller)
}

export interface BranchPayload {
  code: string;
  name: string;
  name_bangla?: string | null;
  district?: string | null;
  division?: string | null;
  address?: string | null;
  contact_number?: string | null;
  email?: string | null;
  is_active?: boolean;
}

export interface DeleteBranchResponse {
  success: boolean;
  message: string;
}
