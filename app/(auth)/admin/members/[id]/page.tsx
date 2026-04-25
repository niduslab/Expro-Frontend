"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMember } from "@/lib/hooks/admin/useMembers";
import MemberHeader from "../../components/member-profile/MemberHeader";
import TabNavigation from "../../components/member-profile/TabNavigation";
import ProfileTab from "../../components/member-profile/ProfileTab";
import PensionEnrollmentsTab from "../../components/member-profile/PensionEnrollmentsTab";
import PensionInstallmentsTab from "../../components/member-profile/PensionInstallmentsTab";
import WalletTab from "../../components/member-profile/WalletTab";
import WalletTransactionsTab from "../../components/member-profile/WalletTransactionsTab";
import NomineesTab from "../../components/member-profile/NomineesTab";
import EditProfileModal from "../../components/member-profile/EditProfileModal";

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = Number(params.id);
  const [activeTab, setActiveTab] = useState<'profile' | 'pension_enrollments' | 'pension_installments' | 'wallet' | 'wallet_transactions' | 'nominees'>('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: response, isLoading, error } = useMember(memberId);
  const member = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
              <p className="text-[#4A5565]">Loading member details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load member details</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberProfile = member.member;
  const wallet = member.wallet;
  const pensionEnrollments = member.pension_enrollments || [];
  const nominees = member.nominee || [];

  const handleTabChange = (tab: 'profile' | 'pension_enrollments' | 'pension_installments' | 'wallet' | 'wallet_transactions' | 'nominees') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen  bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto space-y-6">
        <MemberHeader 
          member={member} 
          memberProfile={memberProfile}
          onEditClick={() => setIsEditModalOpen(true)}
        />
        
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          counts={{
            pensionEnrollments: pensionEnrollments.length,
            pensionInstallments: member.pension_installments?.length || 0,
            walletTransactions: member.wallet_transactions?.length || 0,
            nominees: nominees.length,
          }}
        />

        {activeTab === 'profile' && (
          <ProfileTab
            member={member}
            memberProfile={memberProfile}
            wallet={wallet}
            pensionEnrollments={pensionEnrollments}
            nominees={nominees}
          />
        )}

        {activeTab === 'pension_enrollments' && (
          <PensionEnrollmentsTab pensionEnrollments={pensionEnrollments} />
        )}

        {activeTab === 'pension_installments' && (
          <PensionInstallmentsTab pensionInstallments={member.pension_installments || []} />
        )}

        {activeTab === 'wallet' && (
          <WalletTab wallet={wallet} />
        )}

        {activeTab === 'wallet_transactions' && (
          <WalletTransactionsTab walletTransactions={member.wallet_transactions || []} />
        )}

        {activeTab === 'nominees' && (
          <NomineesTab nominees={nominees} userId={memberId} />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={memberId}
        memberProfile={memberProfile}
      />
    </div>
  );
}
