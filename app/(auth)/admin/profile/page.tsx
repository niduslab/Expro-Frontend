"use client";

import { ReactNode, useState } from "react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";

import { Edit, Check, X } from "lucide-react";
import AccountSection from "./AccountSection";
import PersonalInfoSection from "./personalInfo";
import MembershipSection from "./MembershipSection";

import DateDisplay from "@/components/DateTimeDisplay";
import EditableSection from "./Section";

type Field = {
  label: string;
  value: ReactNode;
  rawValue: any;
  key: string;
  type?: "text" | "date" | "select" | "boolean";
  options?: { label: string; value: any }[];
};

const Profile = () => {
  const { data, isLoading } = useMyProfile();
  const profile = data;

  if (isLoading) return <p className="p-6">Loading...</p>;

  const handleSectionSave = (section: string, updated: Record<string, any>) => {
    console.log("Save section:", section, updated);
    // TODO: call API to update this section
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      <ProfileHeader />
      <ProfileCard profile={profile} />

      <AccountSection
        email={profile?.email}
        status={profile?.status}
        lastLogin={
          profile?.last_login_at
            ? new Date(profile.last_login_at).toLocaleDateString()
            : "-"
        }
        onStatusSave={(updatedStatus: string) => {
          console.log("Update Status:", updatedStatus);
          // call your status update API here
        }}
      />

      <PersonalInfoSection
        fields={[
          {
            label: "Bangla Name",
            value: profile?.member?.name_bangla,
            rawValue: profile?.member?.name_bangla,
            key: "name_bangla",
          },
          {
            label: "English Name",
            value: profile?.member?.name_english,
            rawValue: profile?.member?.name_english,
            key: "name_english",
          },
          {
            label: "Father/Husband",
            value: profile?.member?.father_husband_name,
            rawValue: profile?.member?.father_husband_name,
            key: "father_husband_name",
          },
          {
            label: "Mother",
            value: profile?.member?.mother_name,
            rawValue: profile?.member?.mother_name,
            key: "mother_name",
          },
          {
            label: "DOB",
            value: <DateDisplay date={new Date()} />,
            rawValue: profile?.member?.user_date_of_birth,
            key: "user_date_of_birth",
            type: "date",
          },
          {
            label: "Gender",
            value: profile?.member?.gender || "-",
            rawValue: profile?.member?.gender,
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
            value: profile?.member?.religion,
            rawValue: profile?.member?.religion,
            key: "religion",
          },
          {
            label: "Mobile",
            value: profile?.member?.mobile,
            rawValue: profile?.member?.mobile,
            key: "mobile",
          },
          {
            label: "Alt Mobile",
            value: profile?.member?.alternate_mobile,
            rawValue: profile?.member?.alternate_mobile,
            key: "alternate_mobile",
          },
        ]}
        onSave={(updated) => handleSectionSave("personal", updated)}
      />

      <EditableSection
        title="Address"
        fields={[
          {
            label: "Permanent",
            value: profile?.member?.permanent_address,
            rawValue: profile?.member?.permanent_address,
            key: "permanent_address",
          },
          {
            label: "Present",
            value: profile?.member?.present_address,
            rawValue: profile?.member?.present_address,
            key: "present_address",
          },
        ]}
        onSave={(updated) => handleSectionSave("address", updated)}
      />

      <MembershipSection
        fields={[
          {
            label: "Member ID",
            value: profile?.member?.member_id,
            rawValue: profile?.member?.member_id,

            key: "member_id",
          },
          {
            label: "SL No",
            value: profile?.member?.sl_no,
            rawValue: profile?.member?.sl_no,
            key: "sl_no",
          },
          {
            label: "Fee Paid",
            value: profile?.member?.member_fee_paid ? "Yes" : "No",
            rawValue: profile?.member?.member_fee_paid,
            key: "member_fee_paid",
          },
          {
            label: "Start Date",
            value: <DateDisplay date={profile?.member?.membership_date} />,
            rawValue: profile?.member?.membership_date,
            key: "membership_date",
            type: "date",
          },
          {
            label: "Expire Date",
            value: (
              <DateDisplay date={profile?.member?.membership_expiry_date} />
            ),
            rawValue: profile?.member?.membership_expiry_date,
            key: "membership_expiry_date",
            type: "date",
          },

          {
            label: "Missed Payments",
            value: profile?.member?.consecutive_missed_payments,
            rawValue: profile?.member?.consecutive_missed_payments,
            key: "consecutive_missed_payments",
          },
        ]}
        onSave={(updated) => handleSectionSave("membership", updated)}
      />
    </div>
  );
};

export default Profile;
