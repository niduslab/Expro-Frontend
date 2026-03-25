/**
 * API Usage Examples
 * Demonstrates how to use the API client and hooks
 */

import { apiRequest } from './axios';

/**
 * Example 1: Direct API Call with apiRequest
 */
export const exampleDirectApiCall = async () => {
  try {
    const response = await apiRequest.get('/myprofile');
    console.log('Profile data:', response.data.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

/**
 * Example 2: POST Request with Data
 */
export const examplePostRequest = async () => {
  try {
    const response = await apiRequest.post('/memberprofile', {
      full_name: 'John Doe',
      phone: '8801712345678',
      date_of_birth: '1990-01-15',
      gender: 'male',
    });
    console.log('Profile created:', response.data.data);
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};

/**
 * Example 3: Using React Query Hooks (see hooks folder)
 * 
 * import { useMembershipApplication } from '@/lib/hooks/public/useMembership';
 * 
 * function MyComponent() {
 *   const { mutate, isLoading } = useMembershipApplication();
 *   
 *   const handleSubmit = (data) => {
 *     mutate(data, {
 *       onSuccess: (response) => {
 *         console.log('Application submitted:', response.data);
 *       },
 *       onError: (error) => {
 *         console.error('Submission failed:', error);
 *       }
 *     });
 *   };
 * }
 */

/**
 * Example 4: Paginated Request
 */
export const examplePaginatedRequest = async (page: number = 1) => {
  try {
    const response = await apiRequest.get('/public/membership-applications', {
      params: { page, per_page: 15 }
    });
    console.log('Applications:', response.data.data);
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};
