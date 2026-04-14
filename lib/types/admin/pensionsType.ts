export type PensionEnrollmentStatus =
  | "pending"
  | "active"
  | "overdue"
  | "suspended"
  | "completed"
  | "matured"
  | "closed"
  | "cancelled";

export interface PensionPackageRole {
  id: number;
  role: "executive_member" | "project_presenter" | "assistant_pp" | "general_member";
  is_active: boolean;
  assigned_at: string;
  assigned_by: number;
  deactivated_at: string | null;
  notes: string | null;
}

export interface PensionEnrollment {
  id: number;

  enrollment_number: string; // unique string(30)
  user_id: number;
  pension_package_id: number;

  // Dates
  enrollment_date: string; // date
  start_date: string; // date
  maturity_date: string; // date
  profit_share_percentage: string;
  // Payment Tracking
  total_installments: number;
  installments_paid: number;
  installments_remaining: number;
  amount_per_installment: string; // decimal(12, 2)
  total_amount_paid: string; // decimal(15, 2)
  total_amount_due: string; // decimal(15, 2)
  maturity_amount: string; // decimal(15, 2)

  // Due Date Tracking
  next_due_date: string | null; // date
  last_payment_date: string | null; // date
  missed_installments: number;

  // Status
  status: PensionEnrollmentStatus;

  // Sponsor Commission
  sponsored_by: number | null; // foreignId users
  joining_commission_paid: boolean;

  // Package Roles
  package_roles?: PensionPackageRole[];
  current_role?: string;

  notes: string | null; // text

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // softDeletes
}

export type PensionInstallmentStatus =
  | "upcoming"
  | "due"
  | "overdue"
  | "paid"
  | "partial"
  | "waived";

export interface PensionInstallment {
  id: number;

  pension_enrollment_id: number;
  user_id: number;

  // Details
  installment_number: number; // 1 to 100
  due_date: string; // date
  amount: string; // decimal(12, 2)
  late_fee: string; // decimal(12, 2)
  total_amount: string; // decimal(12, 2)

  // Payment
  paid_date: string | null; // date
  amount_paid: string; // decimal(12, 2)
  payment_reference: string | null; // string

  // Status
  status: PensionInstallmentStatus;

  // Commission Tracking
  commission_processed: boolean;
  commission_processed_at: string | null; // timestamp

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // softDeletes
}
