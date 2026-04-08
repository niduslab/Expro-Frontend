"use client";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, Users, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { 
  useMembershipRequest,
  useApproveMembershipRequest,
  useRejectMembershipRequest 
} from "@/lib/hooks/admin/useMembershipRequests";
import { toast } from "sonner";
import { useState } from "react";
import RejectModal from "../RejectModal";

type Status = "approved" | "pending" | "rejected" | "payment_pending";

const statusConfig: Record<Status, { icon: React.ReactNode; style: string; text: string }> = {
  approved: {
    icon: <CheckCircle className="h-5 w-5" />,
    style: "bg-[#DFF1E9] text-[#29A36A] border border-[#A8DAC3]",
    text: "Approved",
  },
  pending: {
    icon: <Clock className="h-5 w-5" />,
    style: "bg-[#FEF3C7] text-[#F59E0B] border border-[#FCD34D]",
    text: "Pending",
  },
  rejected: {
    icon: <XCircle className="h-5 w-5" />,
    style: "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]",
    text: "Rejected",
  },
  payment_pending: {
    icon: <Clock className="h-5 w-5" />,
    style: "bg-[#E0E7FF] text-[#6366F1] border border-[#A5B4FC]",
    text: "Payment Pending",
  },
};

export default function MembershipRequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const { data: requestData, isLoading, error } = useMembershipRequest(id);
  const { mutate: approveRequest, isPending: isApproving } = useApproveMembershipRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectMembershipRequest();

  const application = requestData?.data?.application;
  const payment = requestData?.data?.payment;
  const pensionPackage = requestData?.data?.pension_package;

  const handleApprove = () => {
    if (!application) return;
    if (!confirm(`Are you sure you want to approve the application from "${application.name_english}"?`)) {
      return;
    }

    toast.loading("Approving application...", { id: "approve-request" });

    approveRequest(id, {
      onSuccess: (res) => {
        toast.success(res.message || "Application approved successfully!", { id: "approve-request" });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to approve application", { id: "approve-request" });
      },
    });
  };

  const handleRejectConfirm = (reason: string) => {
    toast.loading("Rejecting application...", { id: "reject-request" });

    rejectRequest(
      { id, reason },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Application rejected successfully!", { id: "reject-request" });
          setRejectModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to reject application", { id: "reject-request" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
          <p className="text-[#4A5565]">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load application details</p>
          <p className="text-sm text-[#4A5565] mb-4">{(error as any)?.message || "Application not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#4A5565] hover:text-[#030712] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-[14px] font-medium">Back to Applications</span>
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] font-semibold text-[#030712] mb-2">
                Application Details
              </h1>
              <p className="text-[14px] text-[#4A5565]">
                Application #{application.application_number}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-[14px] ${
                  statusConfig[application.status as Status]?.style || statusConfig.pending.style
                }`}
              >
                {statusConfig[application.status as Status]?.icon || statusConfig.pending.icon}
                {statusConfig[application.status as Status]?.text || "Pending"}
              </span>

              {application.status !== "approved" && application.status !== "rejected" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-2 px-4 py-2 bg-[#29A36A] text-white rounded-lg hover:bg-[#228B5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <User size={20} className="text-[#068847]" />
                Applicant Information
              </h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      application.photo
                        ? application.photo.startsWith('http')
                          ? application.photo
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${application.photo}`
                        : "/images/dashboard/memberApproval/1.jpg"
                    }
                    alt={application.name_english}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover w-24 h-24"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[20px] font-semibold text-[#030712] mb-1">
                    {application.name_english}
                  </h3>
                  <p className="text-[16px] text-[#4A5565] mb-3">
                    {application.name_bangla}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[14px] text-[#4A5565]">
                      <Mail size={16} className="text-[#068847]" />
                      {application.email}
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-[#4A5565]">
                      <Phone size={16} className="text-[#068847]" />
                      {application.mobile}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Father/Husband Name" value={application.father_husband_name || "N/A"} />
                <InfoItem label="Mother Name" value={application.mother_name || "N/A"} />
                <InfoItem label="Date of Birth" value={new Date(application.date_of_birth).toLocaleDateString("en-GB")} />
                <InfoItem label="Gender" value={application.gender ? application.gender.charAt(0).toUpperCase() + application.gender.slice(1) : "N/A"} />
                <InfoItem label="Religion" value={application.religion || "N/A"} />
                <InfoItem label="NID Number" value={application.nid_number || "N/A"} />
                <InfoItem label="Academic Qualification" value={application.academic_qualification ? application.academic_qualification.toUpperCase() : "N/A"} />
                <InfoItem label="Membership Type" value={application.membership_type ? application.membership_type.charAt(0).toUpperCase() + application.membership_type.slice(1) : "N/A"} />
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[#068847]" />
                Address Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
                    Present Address
                  </label>
                  <p className="text-[14px] text-[#030712]">{application.present_address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
                    Permanent Address
                  </label>
                  <p className="text-[14px] text-[#030712]">{application.permanent_address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Nominees Card */}
            {application.nominees && application.nominees.length > 0 && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[#068847]" />
                  Nominees
                </h2>

                <div className="space-y-4">
                  {application.nominees.map((nominee, index) => (
                    <div key={index} className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
                            Name
                          </label>
                          <p className="text-[14px] text-[#030712] font-medium">{nominee.name}</p>
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
                            Relation
                          </label>
                          <p className="text-[14px] text-[#030712]">{nominee.relation}</p>
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
                            Date of Birth
                          </label>
                          <p className="text-[14px] text-[#030712]">{new Date(nominee.dob).toLocaleDateString("en-GB")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Application Info */}
          <div className="space-y-6">
            {/* Application Status Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#068847]" />
                Application Status
              </h2>

              <div className="space-y-4">
                <InfoItem label="Application Number" value={application.application_number} />
                <InfoItem label="Status" value={statusConfig[application.status as Status]?.text || "Pending"} />
                <InfoItem 
                  label="Applied On" 
                  value={new Date(application.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} 
                />
                <InfoItem 
                  label="Last Updated" 
                  value={new Date(application.updated_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} 
                />
              </div>
            </div>

            {/* Payment Info Card */}
            {payment && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-[#068847]" />
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <InfoItem label="Payment ID" value={payment.payment_id} />
                  <InfoItem label="Amount" value={`৳${parseFloat(payment.amount).toLocaleString()}`} />
                  <InfoItem label="Gateway Fee" value={`৳${parseFloat(payment.gateway_fee).toLocaleString()}`} />
                  <InfoItem label="Payment Method" value={payment.payment_method.toUpperCase()} />
                  <InfoItem 
                    label="Payment Status" 
                    value={
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium ${
                        payment.status === 'completed' ? 'bg-[#DFF1E9] text-[#29A36A]' :
                        payment.status === 'failed' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                        'bg-[#FEF3C7] text-[#F59E0B]'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    } 
                  />
                  {payment.gateway_transaction_id && (
                    <InfoItem label="Transaction ID" value={payment.gateway_transaction_id} />
                  )}
                </div>
              </div>
            )}

            {/* Pension Package Card */}
            {pensionPackage && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Package size={20} className="text-[#068847]" />
                  Pension Package
                </h2>

                <div className="space-y-4">
                  <InfoItem label="Package Name" value={pensionPackage.name} />
                  <InfoItem label="Package Name (Bangla)" value={pensionPackage.name_bangla} />
                  <InfoItem label="Monthly Amount" value={`৳${parseFloat(pensionPackage.monthly_amount).toLocaleString()}`} />
                  <InfoItem label="Total Installments" value={`${pensionPackage.total_installments} months`} />
                  <InfoItem label="Maturity Amount" value={`৳${parseFloat(pensionPackage.maturity_amount).toLocaleString()}`} />
                  <InfoItem 
                    label="Package Status" 
                    value={
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[12px] font-medium ${
                        pensionPackage.status === 'active' ? 'bg-[#DFF1E9] text-[#29A36A]' :
                        'bg-[#FEE2E2] text-[#DC2626]'
                      }`}>
                        {pensionPackage.status.charAt(0).toUpperCase() + pensionPackage.status.slice(1)}
                      </span>
                    } 
                  />
                </div>
              </div>
            )}

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <h2 className="text-[18px] font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <User size={20} className="text-[#068847]" />
                Additional Information
              </h2>

              <div className="space-y-4">
                <InfoItem label="Sponsor ID" value={application.sponsor_id?.toString() || "N/A"} />
                <InfoItem label="Branch ID" value={application.branch_id?.toString() || "Not Assigned"} />
                <InfoItem label="Pension Package ID" value={application.pension_package_id?.toString() || "Not Selected"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantName={application.name_english}
        isLoading={isRejecting}
      />
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <p className="text-[14px] text-[#030712] font-medium">{value}</p>
    </div>
  );
}
