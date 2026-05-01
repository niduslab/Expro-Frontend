import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { 
  validateSponsor, 
  searchSponsors, 
  getSponsorDetails,
  SponsorValidationResult,
  SponsorSearchResult,
  SponsorDetails,
  SponsorSearchParams
} from '@/lib/api/functions/public/sponsorApi';
import { ApiResponse } from '@/lib/api/axios';

/**
 * Hook: Validate Sponsor Eligibility
 * Validates if a user is eligible to be a sponsor by user_id or member_id
 * 
 * @param userId - User ID (optional)
 * @param memberId - Member ID (optional)
 * @param enabled - Whether the query should run (default: false, must be explicitly enabled)
 * @returns React Query result with sponsor validation data
 * 
 * @example
 * // Validate by member ID
 * const { data, isLoading, refetch } = useValidateSponsor(undefined, 'EXP001', false);
 * // Call refetch() when user clicks "Verify" button
 * 
 * @example
 * // Validate by user ID
 * const { data, isLoading } = useValidateSponsor(123, undefined, true);
 */
export const useValidateSponsor = (
  userId?: number,
  memberId?: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['validateSponsor', userId, memberId],
    queryFn: async () => {
      const response = await validateSponsor(userId, memberId);
      return response.data;
    },
    enabled: enabled && (!!userId || !!memberId),
    staleTime: 0, // Always fetch fresh data for validation
    retry: false, // Don't retry on failure
  });
};

/**
 * Hook: Search Sponsors
 * Search for sponsors by name, member_id, email, or phone
 * 
 * @param params - Search parameters (query, eligible_only, limit)
 * @param enabled - Whether the query should run (default: false)
 * @returns React Query result with search results
 * 
 * @example
 * const [searchParams, setSearchParams] = useState<SponsorSearchParams | null>(null);
 * const { data, isLoading } = useSearchSponsors(searchParams, !!searchParams);
 * 
 * // Trigger search
 * setSearchParams({ query: 'john', eligible_only: true, limit: 10 });
 */
export const useSearchSponsors = (
  params: SponsorSearchParams | null,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['searchSponsors', params],
    queryFn: async () => {
      if (!params) return [];
      const response = await searchSponsors(params);
      return response.data || [];
    },
    enabled: enabled && !!params?.query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Sponsor Details
 * Retrieves complete information about a sponsor
 * 
 * @param sponsorId - User ID of the sponsor
 * @param enabled - Whether the query should run (default: true if sponsorId exists)
 * @returns React Query result with sponsor details
 * 
 * @example
 * const { data, isLoading } = useSponsorDetails(123);
 */
export const useSponsorDetails = (
  sponsorId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['sponsorDetails', sponsorId],
    queryFn: async () => {
      if (!sponsorId) return null;
      const response = await getSponsorDetails(sponsorId);
      return response.data;
    },
    enabled: enabled && !!sponsorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Re-export types for convenience
 */
export type {
  SponsorValidationResult,
  SponsorSearchResult,
  SponsorDetails,
  SponsorSearchParams,
};
