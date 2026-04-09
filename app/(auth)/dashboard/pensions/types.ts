import {
  PensionEnrollment,
  PensionInstallment,
} from "@/lib/types/admin/pensionsType";

export type { PensionEnrollment, PensionInstallment };

export interface PensionPageProps {
  enrollments: PensionEnrollment[];
  installments: PensionInstallment[];
  /** Optional: map of enrollment_id → enrollment_number for installments tab */
  enrollmentNumbers?: Record<number, string>;
}

export type Tab = "enrollments" | "installments";
