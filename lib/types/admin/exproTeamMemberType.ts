export interface ExproTeamMember {
  id: number;
  name: string;
  designation: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExproTeamMemberListResponse {
  success: boolean;
  message: string;
  data: ExproTeamMember[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SingleExproTeamMemberResponse {
  success: boolean;
  message: string;
  data: ExproTeamMember;
}

export interface ExproTeamMemberPayload {
  name: string;
  designation: string;
  image_url?: string | null;
}

export interface DeleteExproTeamMemberResponse {
  success: boolean;
  message: string;
}
