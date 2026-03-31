export interface User {
  id: number;
  email: string;
}

export interface MemberProfile {
  id: number;
  user?: User;
  user_id: string;
  sl_no: string;
  member_id: string;
  name_bangla?: string;
  name_english: string;
  father_husband_name?: string;
  mother_name?: string;
  user_date_of_birth?: string | null;
  nid_number: string;
  academic_qualification?: string;
  academic_qualification_other?: string | null;
  permanent_address: string;
  present_address: string;
  religion?: string;
  gender: string;
  mobile: string;
  alternate_mobile?: string | null;
  photo?: string | null;
  nid_front_photo?: string | null;
  nid_back_photo?: string | null;
  signature?: string | null;
  member_fee_paid: number;
  membership_date?: string | null;
  membership_expiry_date?: string | null;
  suspended_at?: string | null;
  suspension_reason?: string | null;
  consecutive_missed_payments?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProfileData {
  id: number;
  email: string;
  status: string;
  last_login_at: string;
  member: MemberProfile;
  roles: string[];
  permissions: string[];
}

export interface MyProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}
