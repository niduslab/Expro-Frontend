"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Loader2,
  CreditCard,
  Info,
} from "lucide-react";
import {
  useAvailableRoles,
  useSubmitRoleApplication,
  useMyApplications,
  useMyApplicationStats,
  useCancelApplication,
  useInitiateApplicationPayment,
  useCreateBkashPayment,
} from "@/lib/hooks/user/usePensionRoleApplications";
import { getApplicationDetails } from "@/lib/api/functions/user/pensionRoleApplicationApi";
import { toast } from "sonner";
import { useMemberDashboard } from "@/lib/hooks/admin/useUsers";

export default function RoleApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [applicationReason, setApplicationReason] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data: availableRolesData, isLoading: loadingRoles } = useAvailableRoles();
  const { data: applicationsData, isLoading: loadingApplications, refetch: refetchApplications } = useMyApplications();
  const { data: statsData } = useMyApplicationStats();
  const { data: dashboardData } = useMemberDashboard();
  const submitMutation = useSubmitRoleApplication();
  const cancelMutation = useCancelApplication();
  const initiatePaymentMutation = useInitiateApplicationPayment();
  const createBkashPaymentMutation = useCreateBkashPayment();

  // Check for payment success from callback (only once)
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const hasShownSuccess = sessionStorage.getItem("role_application_payment_success_shown");
    
    if (paymentStatus === "success" && !hasShownSuccess) {
      toast.success("Payment completed successfully! Your application is now under review.");
      localStorage.removeItem("pending_role_application_payment_id");
      localStorage.removeItem("pending_role_application_id");
      sessionStorage.setItem("role_application_payment_success_shown", "true");
      refetchApplications();
      
      // Clean up URL without triggering navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
    
    // Cleanup on unmount
    return () => {
      if (paymentStatus === "success") {
        sessionStorage.removeItem("role_application_payment_success_shown");
      }
    };
  }, [searchParams, refetchApplications]);

  const availableRoles = availableRolesData?.data?.available_roles || [];
  const currentRole = availableRolesData?.data?.current_role;
  const enrollment = availableRolesData?.data?.enrollment;
  const applications = applicationsData?.data?.data || [];
  const stats = statsData?.data;

  // Check if user has an advanced role
  const hasAdvancedRole = currentRole && ['executive_member', 'project_presenter', 'assistant_pp'].includes(currentRole.value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSupportingDocuments((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSupportingDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    if (!applicationReason.trim()) {
      toast.error("Please provide a reason for your application");
      return;
    }

    if (!enrollment?.id) {
      toast.error("No active pension enrollment found");
      return;
    }

    try {
      await submitMutation.mutateAsync({
        pension_enrollment_id: enrollment.id,
        requested_role: selectedRole,
        application_reason: applicationReason,
        supporting_documents: supportingDocuments,
      });

      // Reset form
      setSelectedRole("");
      setApplicationReason("");
      setSupportingDocuments([]);
      setShowApplicationForm(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelApplication = async (id: number) => {
    if (confirm("Are you sure you want to cancel this application?")) {
      await cancelMutation.mutateAsync(id);
    }
  };

  const handlePayNow = async (application: any) => {
    try {
      toast.loading("Preparing payment...");

      // Debug: Log application data
      console.log("Application data:", application);
      console.log("Application ID:", application.id);
      console.log("Application user_id:", application.user_id);

      // If application doesn't have user data, fetch it
      let appData = application;
      if (!application.user) {
        try {
          const detailsResponse = await getApplicationDetails(application.id);
          if (detailsResponse.success) {
            appData = detailsResponse.data;
            console.log("Fetched application details:", appData);
            console.log("Fetched user_id:", appData.user_id);
          }
        } catch (error) {
          console.error("Failed to fetch application details:", error);
        }
      }

      toast.dismiss();
      toast.loading("Initiating payment...");

      // Step 1: Initiate payment (this will create the payment record)
      const paymentInitResponse = await initiatePaymentMutation.mutateAsync(appData.id);
      
      if (!paymentInitResponse.success) {
        toast.dismiss();
        toast.error(paymentInitResponse.message || "Failed to initiate payment");
        return;
      }

      const paymentData = paymentInitResponse.data;
      
      // Store payment info for callback handling
      localStorage.setItem('pending_role_application_payment_id', paymentData.payment_id.toString());
      localStorage.setItem('pending_role_application_id', appData.id.toString());

      toast.dismiss();
      toast.loading("Redirecting to bKash...");
      
      // Step 2: Create bKash payment
      // Get user info from application data or use defaults
      const userName = appData.user?.member_profile?.name_english || 
                       appData.user?.name || 
                       appData.user?.email || 
                       "Member";
      const userEmail = appData.user?.email || "";
      const userPhone = appData.user?.member_profile?.mobile || "";

      const bkashResponse = await createBkashPaymentMutation.mutateAsync({
        amount: appData.application_fee,
        payment_type: "pension_role_application",
        customer_name: userName,
        customer_email: userEmail,
        customer_phone: userPhone,
        reference_id: appData.id,
      });

      if (!bkashResponse.success) {
        toast.dismiss();
        toast.error(bkashResponse.message || "Failed to create payment");
        return;
      }

      // Step 3: Redirect to bKash payment URL (same as pension payment)
      const bkashURL = bkashResponse.data?.bkashURL;
      
      if (bkashURL) {
        toast.dismiss();
        toast.success("Redirecting to bKash payment gateway...");
        
        // Direct redirect to bKash payment page
        // bKash will redirect back to backend callback after payment
        // Backend will handle the callback and update the application status
        window.location.href = bkashURL;
      } else {
        toast.dismiss();
        toast.error("Payment URL not found");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      console.error("Error response:", error.response?.data);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to process payment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "under_review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "payment_pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "payment_pending":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loadingRoles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // If user already has an advanced role, show message
  if (hasAdvancedRole) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You Already Have an Advanced Role
          </h2>
          <p className="text-gray-600 mb-6">
            You currently hold the role of <span className="font-semibold text-green-600">{currentRole?.label}</span>.
            <br />
            You cannot apply for additional roles at this time.
          </p>
          
          {/* Current Role Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Your Current Role</p>
                <h3 className="text-2xl font-bold text-gray-900">{currentRole?.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{currentRole?.label_bangla}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Pension Role Application</h1>
        <p className="text-gray-600 mt-2">
          Apply for advanced roles in your pension plan
        </p>
      </div>

      {/* Current Role Info */}
      {currentRole && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Current Role</p>
              <h3 className="text-2xl font-bold text-gray-900">{currentRole.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{currentRole.label_bangla}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_applications}</p>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <p className="text-3xl font-bold text-blue-600">{stats.under_review}</p>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Payment Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.payment_pending}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Roles */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Roles</h2>
            
            {availableRoles.length === 0 ? (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No roles available to apply for at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableRoles.map((role: any) => (
                  <div
                    key={role.value}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      selectedRole === role.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => {
                      setSelectedRole(role.value);
                      setShowApplicationForm(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.label_bangla}</p>
                      </div>
                      {role.requires_payment && (
                        <div className="bg-amber-100 border border-amber-200 rounded-lg px-3 py-1">
                          <p className="text-sm font-bold text-amber-700">
                            ৳{parseFloat(role.fee).toLocaleString("en-BD")}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    {role.requires_payment && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <CreditCard className="w-4 h-4" />
                        Payment required via bKash
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Form */}
          {showApplicationForm && selectedRole && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Application</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Reason *
                  </label>
                  <textarea
                    value={applicationReason}
                    onChange={(e) => setApplicationReason(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="Explain why you want to apply for this role..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload PDF, JPG, JPEG, or PNG files (max 5MB each)
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                    >
                      Choose Files
                    </label>
                  </div>

                  {supportingDocuments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {supportingDocuments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplicationForm(false);
                      setSelectedRole("");
                      setApplicationReason("");
                      setSupportingDocuments([]);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* My Applications */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Applications</h2>
            
            {loadingApplications ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {app.requested_role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{app.application_number}</p>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.replace(/_/g, " ")}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>

                    {app.payment_required && !app.payment_completed && (
                      <button 
                        onClick={() => handlePayNow(app)}
                        disabled={initiatePaymentMutation.isPending || createBkashPaymentMutation.isPending}
                        className="w-full mt-3 bg-amber-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {(initiatePaymentMutation.isPending || createBkashPaymentMutation.isPending) ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3" />
                            Pay Now
                          </>
                        )}
                      </button>
                    )}

                    {(app.status === "payment_pending" || app.status === "under_review") && (
                      <button
                        onClick={() => handleCancelApplication(app.id)}
                        disabled={cancelMutation.isPending}
                        className="w-full mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel Application
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
