"use client";

import { useMyProfile } from "@/lib/hooks/admin/useUsers";

import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import AccountSection from "./AccountSection";
import PersonalInfoSection from "./personalInfo";
import MembershipSection from "./MembershipSection";

import DateDisplay from "@/components/DateTimeDisplay";
import { useUpdateMyProfile } from "@/lib/hooks/admin/useMemberProfilehook";
import EditableSection from "./Section";
import { MemberProfile } from "@/lib/types/admin/memberType";

const Profile = () => {
  const { data, isLoading } = useMyProfile();
  const profile = data;

  const memberId = profile?.member?.id;
  const { mutate: updateProfile } = useUpdateMyProfile(memberId!);
  const userId = profile?.id;

  if (isLoading) return <p className="p-6 text-sm text-gray-400">Loading...</p>;
  if (!profile) return null;

  console.log(userId, "before handlesave");

  const handleSectionSave = (updated: Record<string, any>) => {
    const m = profile.member;
    console.log(userId, "after handlesave");
    const fullPayload: Partial<MemberProfile> = {
      sl_no: m.sl_no,

      name_english: m.name_english,
      user_date_of_birth: m.user_date_of_birth,
      nid_number: m.nid_number,
      permanent_address: m.permanent_address,
      present_address: m.present_address,
      gender: m.gender,
      mobile: m.mobile,
      member_fee_paid: Number(m.member_fee_paid),
      membership_date: m.membership_date,

      name_bangla: m.name_bangla,
      father_husband_name: m.father_husband_name,
      mother_name: m.mother_name,
      religion: m.religion,
      membership_expiry_date: m.membership_expiry_date,
      consecutive_missed_payments: m.consecutive_missed_payments,

      ...updated,

      alternate_mobile:
        updated.alternate_mobile !== undefined
          ? updated.alternate_mobile === ""
            ? null
            : String(updated.alternate_mobile)
          : (m.alternate_mobile ?? null),
      user_id: userId ? String(userId) : undefined,

      ...(updated.member_fee_paid !== undefined && {
        member_fee_paid: Number(updated.member_fee_paid),
      }),
    };
    console.log(userId, "finally handlesave");
    updateProfile(fullPayload);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <ProfileHeader />
      <ProfileCard profile={profile} />

      <AccountSection
        email={profile.email}
        status={profile.status}
        lastLogin={
          profile.last_login_at
            ? new Date(profile.last_login_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : undefined
        }
        onStatusSave={(updatedStatus) =>
          updateProfile({ status: updatedStatus } as any)
        }
      />

      <PersonalInfoSection
        fields={[
          {
            label: "Bangla Name",
            value: profile.member?.name_bangla,
            rawValue: profile.member?.name_bangla,
            key: "name_bangla",
          },
          {
            label: "English Name",
            value: profile.member?.name_english,
            rawValue: profile.member?.name_english,
            key: "name_english",
          },
          {
            label: "Father/Husband",
            value: profile.member?.father_husband_name,
            rawValue: profile.member?.father_husband_name,
            key: "father_husband_name",
          },
          {
            label: "Mother",
            value: profile.member?.mother_name,
            rawValue: profile.member?.mother_name,
            key: "mother_name",
          },
          {
            label: "DOB",
            value: <DateDisplay date={profile.member?.user_date_of_birth} />,
            rawValue: profile.member?.user_date_of_birth,
            key: "user_date_of_birth",
            type: "date",
          },
          {
            label: "Gender",
            value: profile.member?.gender || "—",
            rawValue: profile.member?.gender,
            key: "gender",
            type: "select",
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ],
          },
          {
            label: "Religion",
            value: profile.member?.religion,
            rawValue: profile.member?.religion,
            key: "religion",
          },
          {
            label: "NID Number",
            value: profile.member?.nid_number,
            rawValue: profile.member?.nid_number,
            key: "nid_number",
          },
          {
            label: "Mobile",
            value: profile.member?.mobile,
            rawValue: profile.member?.mobile,
            key: "mobile",
          },
          {
            label: "Alt Mobile",
            value: profile.member?.alternate_mobile,
            rawValue: profile.member?.alternate_mobile,
            key: "alternate_mobile",
          },
        ]}
        onSave={handleSectionSave}
      />

      <EditableSection
        title="Address"
        fields={[
          {
            label: "Permanent",
            value: profile.member?.permanent_address,
            rawValue: profile.member?.permanent_address,
            key: "permanent_address",
          },
          {
            label: "Present",
            value: profile.member?.present_address,
            rawValue: profile.member?.present_address,
            key: "present_address",
          },
        ]}
        onSave={handleSectionSave}
      />

      <MembershipSection
        fields={[
          {
            label: "Member ID",
            value: profile.member?.member_id,
            rawValue: profile.member?.member_id,
            key: "member_id",
          },
          {
            label: "SL No",
            value: profile.member?.sl_no,
            rawValue: profile.member?.sl_no,
            key: "sl_no",
          },
          {
            label: "Fee Paid",
            value: profile.member?.member_fee_paid ? "Yes" : "No",
            rawValue: profile.member?.member_fee_paid,
            key: "member_fee_paid",
            type: "boolean",
          },
          {
            label: "Start Date",
            value: <DateDisplay date={profile.member?.membership_date} />,
            rawValue: profile.member?.membership_date,
            key: "membership_date",
            type: "date",
          },
          {
            label: "Expire Date",
            value: (
              <DateDisplay date={profile.member?.membership_expiry_date} />
            ),
            rawValue: profile.member?.membership_expiry_date,
            key: "membership_expiry_date",
            type: "date",
          },
          {
            label: "Missed Payments",
            value: profile.member?.consecutive_missed_payments,
            rawValue: profile.member?.consecutive_missed_payments,
            key: "consecutive_missed_payments",
          },
        ]}
        onSave={handleSectionSave}
      />
    </div>
  );
};

export default Profile;
