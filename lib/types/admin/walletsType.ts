export interface Wallet {
  id: number;
  user_id: number;

  // Balances
  balance: string; // decimal(15, 2)
  commission_balance: string; // decimal(15, 2)

  // Statistics
  total_deposited: string; // decimal(15, 2)
  total_withdrawn: string; // decimal(15, 2)
  total_commission_earned: string; // decimal(15, 2)
  total_membership_paid: string; // decimal(15, 2)
  total_pension_paid: string; // decimal(15, 2)

  // Lock Status
  is_locked: boolean;
  locked_at: string | null; // timestamp
  lock_reason: string | null; // text

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // softDeletes
}
// Define enums as union types for strict checking
export type TransactionType = "credit" | "debit";

export type TransactionCategory =
  | "deposit"
  | "withdrawal"
  | "membership_fee"
  | "pension_installment"
  | "joining_commission"
  | "installment_commission"
  | "team_commission"
  | "executive_commission"
  | "refund"
  | "adjustment"
  | "transfer_in"
  | "transfer_out"
  | "renewal_fee";

export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export interface WalletDto {
  data: Wallet;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  user_id: number;

  // Details
  transaction_id: string; // unique string(50)
  type: TransactionType;
  category: TransactionCategory;

  // Amounts
  amount: string; // decimal(15, 2)
  balance_before: string; // decimal(15, 2)
  balance_after: string; // decimal(15, 2)

  // Reference (Polymorphic-like or specific link)
  reference_type: string | null;
  reference_id: number | null; // unsignedBigInteger

  description: string | null; // text
  notes: string | null; // text

  // Status
  status: TransactionStatus;

  // Audit
  processed_by: number | null; // foreignId users
  processed_at: string | null; // timestamp

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // softDeletes
}
export interface WalletTransactionsParams {
  page?: number;
  per_page?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  date_from?: string;
  date_to?: string;
}
