export interface DonationDataType {
  id?: number;

  project_id: number;
  user_id?: number | null;

  donor_name: string;
  donor_email: string;
  donor_phone: string;

  amount: number;
  currency: string;

  type: "one_time" | "recurring";
  status: "pending" | "completed" | "failed";

  purpose?: string;
  message?: string;

  is_anonymous?: boolean;

  payment_id?: number | null;
  wallet_transaction_id?: number | null;

  receipt_number?: string;
  metadata?: string;

  created_at?: string;
  updated_at?: string;
}

export type CreateDonationInput = Omit<
  DonationDataType,
  "id" | "created_at" | "updated_at"
>;

export type UpdateDonationInput = Partial<
  Omit<DonationDataType, "id" | "created_at" | "updated_at">
>;
export interface DonationListResponse {
  data: DonationDataType[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
