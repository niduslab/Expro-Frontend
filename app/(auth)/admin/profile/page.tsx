"use client";

import SimpleDateTime from "@/components/simpleDateTime/page";
import { useMyProfile } from "@/lib/hooks/admin/useMemberProfile";

const InfoItem = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const Profile = () => {
  const { data, isLoading } = useMyProfile();
  const profile = data;

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Profile
        </h1>
        <p className="text-sm text-gray-500">Manage your profile information</p>
      </div>

      {/* Top Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
          {profile?.member?.photo ? (
            <img
              src={profile.member.photo}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-900">
            {profile?.member?.name_english}
          </h2>
          <p className="text-sm text-gray-500">{profile?.email}</p>

          <div className="flex gap-2 mt-2 flex-wrap justify-center sm:justify-start">
            {profile?.roles?.map((role) => (
              <span
                key={role}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <Section title="Account Information">
        <InfoItem label="Email" value={profile?.email} />
        <InfoItem label="Status" value={profile?.status} />
        <InfoItem
          label="Last Login"
          value={
            profile?.last_login_at ? (
              <SimpleDateTime datetime={profile.last_login_at} type="date" />
            ) : null
          }
        />
      </Section>

      {/* Personal Info */}
      <Section title="Personal Information">
        <InfoItem label="Bangla Name" value={profile?.member?.name_bangla} />
        <InfoItem label="English Name" value={profile?.member?.name_english} />
        <InfoItem
          label="Father/Husband"
          value={profile?.member?.father_husband_name}
        />
        <InfoItem label="Mother" value={profile?.member?.mother_name} />
        <InfoItem
          label="DOB"
          value={
            profile?.member?.user_date_of_birth ? (
              <SimpleDateTime
                datetime={profile.member.user_date_of_birth}
                type="date"
              />
            ) : null
          }
        />
        <InfoItem label="Gender" value={profile?.member?.gender} />
        <InfoItem label="Religion" value={profile?.member?.religion} />
        <InfoItem label="Mobile" value={profile?.member?.mobile} />
        <InfoItem
          label="Alt Mobile"
          value={profile?.member?.alternate_mobile}
        />
      </Section>

      {/* Address */}
      <Section title="Address">
        <InfoItem
          label="Permanent"
          value={profile?.member?.permanent_address}
        />
        <InfoItem label="Present" value={profile?.member?.present_address} />
      </Section>

      {/* Membership */}
      <Section title="Membership">
        <InfoItem label="Member ID" value={profile?.member?.member_id} />
        <InfoItem label="SL No" value={profile?.member?.sl_no} />
        <InfoItem
          label="Fee Paid"
          value={profile?.member?.member_fee_paid ? "Yes" : "No"}
        />
        <InfoItem
          label="Start Date"
          value={
            profile?.member?.membership_date ? (
              <SimpleDateTime
                datetime={profile.member.membership_date}
                type="date"
              />
            ) : null
          }
        />
        <InfoItem
          label="Expiry Date"
          value={
            profile?.member?.membership_expiry_date ? (
              <SimpleDateTime
                datetime={profile.member.membership_expiry_date}
                type="date"
              />
            ) : null
          }
        />
        <InfoItem
          label="Missed Payments"
          value={profile?.member?.consecutive_missed_payments}
        />
      </Section>
    </div>
  );
};

export default Profile;
