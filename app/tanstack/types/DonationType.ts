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
}

export type CreateDonationInput = Omit<DonationDataType, "id">;

export type UpdateDonationInput = Partial<Omit<DonationDataType, "id">>;
