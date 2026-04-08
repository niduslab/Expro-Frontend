"use client";
import { ChevronRight, CircleCheck, CircleX, Eye, Clock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  useMembershipRequests, 
  useApproveMembershipRequest,
  useRejectMembershipRequest 
} from "@/lib/hooks/admin/useMembershipRequests";
import { toast } from "sonner";
import RejectModal from "./RejectModal";

type Status = "approved" | "pending" | "rejected" | "payment_pending";

const statusConfig: Record<Status, { icon: React.ReactNode; style: string }> = {
  approved: {
    icon: <CircleCheck className="h-3.5 w-3.5" />,
    style: "bg-[#DFF1E9] text-[#29A36A] border border-[#A8DAC3]",
  },
  pending: {
    icon: <Clock className="h-3.5 w-3.5" />,
    style: "bg-[#FEF3C7] text-[#F59E0B] border border-[#FCD34D]",
  },
  rejected: {
    icon: <CircleX className="h-3.5 w-3.5" />,
    style: "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]",
  },
  payment_pending: {
    icon: <Clock className="h-3.5 w-3.5" />,
    style: "bg-[#E0E7FF] text-[#6366F1] border border-[#A5B4FC]",
  },
};

export default function MembershipRequestPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{ id: number; name: string } | null>(null);

  const { data: requestsData, isLoading, error } = useMembershipRequests({
    page: currentPage,
    per_page: 15,
  });

  const { mutate: approveRequest, isPending: isApproving } = useApproveMembershipRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectMembershipRequest();

  const handleApprove = (id: number, fullName: string) => {
    if (!confirm(`Are you sure you want to approve the application from "${fullName}"?`)) {
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

  const handleRejectClick = (id: number, fullName: string) => {
    setSelectedRequest({ id, name: fullName });
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedRequest) return;

    toast.loading("Rejecting application...", { id: "reject-request" });

    rejectRequest(
      { id: selectedRequest.id, reason },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Application rejected successfully!", { id: "reject-request" });
          setRejectModalOpen(false);
          setSelectedRequest(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to reject application", { id: "reject-request" });
        },
      }
    );
  };

  const requestsArray = requestsData?.data;
  const requests = Array.isArray(requestsArray) ? requestsArray : [];
  const pagination = requestsData?.pagination;

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center mb-5">
          <div className="mb-2">
            <h2 className="font-semibold text-[24px] leading-[120%] tracking-[-0.01em] align-middle mb-0.5 sm:mb-2 text-[#030712]">
              Membership Requests
            </h2>
            <span className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
              Review and manage new member applications
            </span>
          </div>
          <div>
            <button className="flex items-center justify-between w-[151px] gap-2">
              <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] text-center text-[#068847]">
                View ALL Members
              </span>
              <ChevronRight className="text-[#068847]" size={16} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
              <p className="text-[#4A5565]">Loading membership requests...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load membership requests</p>
              <p className="text-sm text-[#4A5565]">{(error as any)?.message || "Please try again later"}</p>
            </div>
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-[#4A5565] mb-2">No membership requests found</p>
              <p className="text-sm text-[#6A7282]">New applications will appear here</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border border-[#DEE3E7] rounded-2xl">
              <div className="w-full max-w-full overflow-x-auto scrollbar-thin">
                <table className="w-full table-auto whitespace-nowrap">
                  <thead>
                    <tr className="text-[#030712] bg-[#EBEDF066] border-b border-[#DEE3E7]">
                      <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Application No
                      </th>
                      <th className="text-left py-3 px-8 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Name
                      </th>
                      <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Type
                      </th>
                      <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Contact
                      </th>
                      <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Applied
                      </th>
                      <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Status
                      </th>
                      <th className="text-center py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request: any) => (
                      <tr
                        key={request.id}
                        className="rounded-2xl relative border-b last:border-none border-[#F3F4F6] hover:bg-gray-50"
                      >
                        <td className="py-4 px-2">
                          <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#73808C]">
                            {request.application_number}
                          </p>
                        </td>
                        <td className="py-4 px-8 xl:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <Image
                                src={
                                  request.photo
                                    ? request.photo.startsWith('http')
                                      ? request.photo
                                      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${request.photo}`
                                    : "/images/dashboard/memberApproval/1.jpg"
                                }
                                alt={request.name_english}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] text-[#030712]">
                                {request.name_english}
                              </p>
                              <p className="font-normal text-[12px] leading-[150%] tracking-[-1%] text-[#4A5565]">
                                {request.mobile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#030712] capitalize">
                            {request.membership_type}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <div>
                            <p className="font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#030712]">
                              {request.email}
                            </p>
                            <p className="font-normal text-[12px] leading-[150%] tracking-[-1%] align-middle text-[#4A5565]">
                              NID: {request.nid_number}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-normal text-[14px] leading-[20px] tracking-0 align-middle text-[#73808C]">
                            {new Date(request.created_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-[12px] leading-[150%] tracking-[-1%] ${
                              statusConfig[request.status as Status]?.style || statusConfig.pending.style
                            }`}
                          >
                            {statusConfig[request.status as Status]?.icon || statusConfig.pending.icon}
                            {request.status === "payment_pending" ? "Payment Pending" : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-normal text-[14px] leading-[20px] tracking-0 align-middle">
                          <div className="flex items-center justify-center gap-[16px] h-[16px]">
                            {request.status !== "approved" && (
                              <>
                                <button
                                  onClick={() => handleApprove(request.id, request.name_english)}
                                  disabled={isApproving || isRejecting}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Approve"
                                >
                                  <CircleCheck className="text-[#29A36A] h-[22px] w-[22px]" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(request.id, request.name_english)}
                                  disabled={isApproving || isRejecting}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Reject"
                                >
                                  <CircleX className="text-[#DC2828] h-[22px] w-[22px]" />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => router.push(`/admin/membership-request/${request.id}`)}
                              title="View Details"
                            >
                              <Eye className="text-[#73808C] h-[22px] w-[22px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-[#6B7280]">
                  Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} total results)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-[#D1D5DC] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-4 py-2 border border-[#D1D5DC] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantName={selectedRequest?.name || ""}
        isLoading={isRejecting}
      />
    </>
  );
}
