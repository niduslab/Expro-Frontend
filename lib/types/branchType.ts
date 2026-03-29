export interface Branch {
  id: number;
  code: string;
  name: string;
  name_bangla?: string | null;
  district: string;
  division: string;
  address: string;
  contact_number: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BranchListResponse {
  success: boolean;
  message: string;
  data: Branch[];
}

export interface SingleBranchResponse {
  success: boolean;
  message: string;
  data: Branch;
}
