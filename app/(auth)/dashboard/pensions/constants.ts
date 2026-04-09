import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { PensionInstallmentStatus } from "@/lib/types/admin/pensionsType";

export const enrollmentStatusConfig: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    icon: Clock,
  },
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
  suspended: {
    label: "Suspended",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    icon: Ban,
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    icon: CheckCircle2,
  },
  matured: {
    label: "Matured",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    icon: TrendingUp,
  },
  closed: {
    label: "Closed",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

export const installmentStatusConfig: Record<
  PensionInstallmentStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  upcoming: {
    label: "Upcoming",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  due: {
    label: "Due",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  overdue: {
    label: "Overdue",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  partial: {
    label: "Partial",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  waived: {
    label: "Waived",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};
