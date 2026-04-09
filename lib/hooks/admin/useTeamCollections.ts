import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, PaginatedResponse } from '@/lib/api/axios';

/**
 * Team Collection Types
 */
export interface TeamCollection {
  id: number;
  team_leader_id: number;
  period_month: string;
  total_collection: number;
  membership_collection: number;
  pension_collection: number;
  lakh_milestones_reached: number;
  commission_eligible_amount: number;
  team_member_count: number;
  active_contributors: number;
  commission_calculated: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  team_leader?: {
    id: number;
    email: string;
    member?: {
      name_english: string;
      name_bangla?: string;
      phone?: string;
    };
  };
}

export interface TeamMemberContribution {
  id: number;
  team_collection_id: number;
  member_id: number;
  total_contribution: number;
  membership_contribution: number;
  pension_contribution: number;
  contribution_percentage: number;
  commission_earned: number;
  created_at: string;
  updated_at: string;
  member?: {
    id: number;
    email: string;
    member?: {
      name_english: string;
      name_bangla?: string;
      phone?: string;
    };
  };
  team_collection?: TeamCollection;
}

export interface TeamCollectionsParams {
  page?: number;
  per_page?: number;
  team_leader_id?: number;
  period_month?: string;
  pension_package_id?: number;
}

export interface TeamMemberContributionsParams {
  page?: number;
  per_page?: number;
  team_collection_id?: number;
  member_id?: number;
}

/**
 * Hook: Get Team Collections
 * Fetches team collections with optional filtering
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated team collections
 * 
 * @example
 * const { data, isLoading } = useTeamCollections({
 *   team_leader_id: 5,
 *   period_month: '2024-03'
 * });
 */
export const useTeamCollections = (params?: TeamCollectionsParams) => {
  return useQuery({
    queryKey: ['team-collections', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<TeamCollection>>(
        '/teamcollections',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook: Get Single Team Collection
 * Fetches a specific team collection by ID
 * 
 * @param id - Team collection ID
 * @returns React Query result with team collection data
 * 
 * @example
 * const { data, isLoading } = useTeamCollection(1);
 */
export const useTeamCollection = (id: number) => {
  return useQuery({
    queryKey: ['team-collection', id],
    queryFn: async () => {
      const response = await apiRequest.get<TeamCollection>(`/teamcollection/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook: Get Team Member Contributions
 * Fetches team member contributions with optional filtering
 * 
 * @param params - Query parameters for filtering
 * @returns React Query result with paginated contributions
 * 
 * @example
 * const { data, isLoading } = useTeamMemberContributions({
 *   team_collection_id: 1
 * });
 */
export const useTeamMemberContributions = (params?: TeamMemberContributionsParams) => {
  return useQuery({
    queryKey: ['team-member-contributions', params],
    queryFn: async () => {
      const response = await apiRequest.get<PaginatedResponse<TeamMemberContribution>>(
        '/teammembercontributions',
        { params }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook: Get Team Collections by Pension Package
 * Fetches all team collections for a specific pension package
 * 
 * @param packageId - Pension package ID
 * @param periodMonth - Optional period month filter (YYYY-MM)
 * @returns React Query result with team collections
 * 
 * @example
 * const { data, isLoading } = useTeamCollectionsByPackage(1, '2024-03');
 */
export const useTeamCollectionsByPackage = (packageId: number, periodMonth?: string) => {
  return useQuery({
    queryKey: ['team-collections-by-package', packageId, periodMonth],
    queryFn: async () => {
      const params: any = { pension_package_id: packageId, per_page: 100 };
      if (periodMonth) {
        params.period_month = periodMonth;
      }
      const response = await apiRequest.get<PaginatedResponse<TeamCollection>>(
        '/teamcollections',
        { params }
      );
      return response.data;
    },
    enabled: !!packageId,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook: Create Team Collection
 * Creates a new team collection
 * 
 * @returns Mutation function and state
 * 
 * @example
 * const { mutate, isPending } = useCreateTeamCollection();
 * mutate({
 *   team_leader_id: 5,
 *   period_month: '2024-03',
 *   total_collection: 150000
 * });
 */
export const useCreateTeamCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TeamCollection>) => {
      const response = await apiRequest.post('/teamcollection', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-collections'] });
    },
  });
};

/**
 * Hook: Update Team Collection
 * Updates an existing team collection
 * 
 * @returns Mutation function and state
 * 
 * @example
 * const { mutate, isPending } = useUpdateTeamCollection();
 * mutate({ id: 1, total_collection: 200000 });
 */
export const useUpdateTeamCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<TeamCollection> & { id: number }) => {
      const response = await apiRequest.put(`/teamcollection/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-collections'] });
      queryClient.invalidateQueries({ queryKey: ['team-collection', variables.id] });
    },
  });
};

/**
 * Hook: Delete Team Collection
 * Deletes a team collection
 * 
 * @returns Mutation function and state
 * 
 * @example
 * const { mutate, isPending } = useDeleteTeamCollection();
 * mutate(1);
 */
export const useDeleteTeamCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest.delete(`/teamcollection/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-collections'] });
    },
  });
};
