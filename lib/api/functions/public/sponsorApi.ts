import { apiRequest, ApiResponse } from "@/lib/api/axios";

/**
 * Sponsor Validation and Search Types
 */

export interface PensionEnrollment {
  id: number;
  enrollment_number: string;
  package_name: string;
  role: string;
  status: string;
}

export interface SponsorValidationResult {
  is_eligible: boolean;
  reason: string;
  user_id: number;
  member_id: string;
  name: string;
  email: string;
  mobile: string;
  pension_roles: string[];
  system_roles: string[];
  pension_enrollments: PensionEnrollment[];
}

export interface BranchInfo {
  id: number;
  name: string;
  code: string;
}

export interface SponsorDetails {
  user_id: number;
  member_id: string;
  name_english: string;
  name_bangla?: string;
  email: string;
  mobile: string;
  branch?: BranchInfo;
  pension_roles: string[];
  system_roles: string[];
  pension_enrollments: PensionEnrollment[];
  sponsored_members_count: number;
  is_eligible: boolean;
}

/**
 * Backend API Response Types (as returned from server)
 */
export interface BackendSponsorSearchResult {
  id: number;
  email: string;
  phone: string;
  member: {
    name_english: string;
    name_bangla?: string;
    member_id: string;
    mobile: string;
  };
  branch: BranchInfo | null;
  pension_roles: string[];
  system_roles: string[];
  is_eligible: boolean;
}

/**
 * Frontend-friendly Search Result (transformed)
 */
export interface SponsorSearchResult {
  user_id: number;
  member_id: string;
  name: string;
  email: string;
  mobile: string;
  is_eligible: boolean;
  eligibility_reason?: string;
}

export interface SponsorSearchParams {
  query: string;
  eligible_only?: boolean;
  limit?: number;
}

/**
 * Validate sponsor eligibility by user_id or member_id
 * 
 * GET /api/v1/sponsor/validate
 * 
 * Checks if a user is eligible to be a sponsor based on:
 * - Pension roles: executive_member, project_presenter, assistant_pp
 * - System roles: chairman, super-admin, admin, manager
 * 
 * @param userId - User ID (optional)
 * @param memberId - Member ID (optional)
 * @returns Validation result with eligibility status and details
 */
export const validateSponsor = async (
  userId?: number,
  memberId?: string
): Promise<ApiResponse<SponsorValidationResult>> => {
  const params: Record<string, string | number> = {};
  if (userId) params.user_id = userId;
  if (memberId) params.member_id = memberId;

  const response = await apiRequest.get<SponsorValidationResult>(
    "/sponsor/validate",
    { params }
  );
  return response.data;
};

/**
 * Get complete sponsor information
 * 
 * GET /api/v1/sponsor/{sponsorId}
 * 
 * Retrieves detailed information about a sponsor including:
 * - Member profile and branch
 * - All pension roles and enrollments
 * - System roles
 * - Count of sponsored members
 * 
 * @param sponsorId - User ID of the sponsor
 * @returns Complete sponsor details
 */
export const getSponsorDetails = async (
  sponsorId: number
): Promise<ApiResponse<SponsorDetails>> => {
  const response = await apiRequest.get<SponsorDetails>(
    `/sponsor/${sponsorId}`
  );
  return response.data;
};

/**
 * Transform backend search result to frontend format
 */
const transformSearchResult = (result: BackendSponsorSearchResult): SponsorSearchResult => {
  return {
    user_id: result.id,
    member_id: result.member.member_id,
    name: result.member.name_english,
    email: result.email,
    mobile: result.member.mobile || result.phone,
    is_eligible: result.is_eligible,
  };
};

/**
 * Search for sponsors by name, member_id, email, or phone
 * 
 * GET /sponsors/search
 * 
 * Search functionality with optional eligibility filtering:
 * - Searches across name, member_id, email, and phone
 * - Can filter to show only eligible sponsors
 * - Returns eligibility status for each result
 * 
 * @param params - Search parameters
 * @returns List of matching sponsors with eligibility status
 */
export const searchSponsors = async (
  params: SponsorSearchParams
): Promise<ApiResponse<SponsorSearchResult[]>> => {
  const response = await apiRequest.get<BackendSponsorSearchResult[]>(
    "/sponsors/search",
    { params }
  );
  
  // Transform backend results to frontend format
  const transformedData = response.data.data?.map(transformSearchResult) || [];
  
  return {
    ...response.data,
    data: transformedData,
  };
};
