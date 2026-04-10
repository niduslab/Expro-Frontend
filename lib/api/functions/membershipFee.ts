import apiClient, { ApiResponse } from "../axios";

export interface MembershipFee {
  id: number;
  user_id: number;
  fee_type: string;
  amount: string;
  due_date: string;
  paid_date: string | null;
  status: "due" | "paid" | "overdue" | "waived";
  late_fee: string;
  payment_method: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayMembershipFeeRequest {
  fee_id?: number;
  fee_type: string;
  payment_method: string;
}

export interface PayMembershipFeeResponse {
  success: boolean;
  message: string;
  data: {
    payment_id: number;
    bkashURL?: string;
    gateway_url?: string;
  };
}

// Get user's membership fees
export const getMyMembershipFees = async (): Promise<MembershipFee[]> => {
  const res = await apiClient.get<ApiResponse<MembershipFee[]>>(
    "/my-membership-fees",
    {
      withCredentials: true,
    }
  );
  return res.data?.data ?? [];
};

// Get upcoming/due membership fees
export const getUpcomingMembershipFees = async (): Promise<MembershipFee[]> => {
  const res = await apiClient.get<ApiResponse<MembershipFee[]>>(
    "/membership-fees/upcoming",
    {
      withCredentials: true,
    }
  );
  return res.data?.data ?? [];
};

// Initiate membership fee payment
export const payMembershipFee = async (
  data: PayMembershipFeeRequest
): Promise<PayMembershipFeeResponse> => {
  const res = await apiClient.post<PayMembershipFeeResponse>(
    "/membership-fee/pay",
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
