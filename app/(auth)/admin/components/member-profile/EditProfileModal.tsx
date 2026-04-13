"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUpdateMemberProfile, UpdateMemberProfileData } from "@/lib/hooks/admin/useMembers";
import { toast } from "sonner";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  memberProfile: any;
}

export default function EditProfileModal({ isOpen, onClose, userId, memberProfile }: EditProfileModalProps) {
  const { mutate: updateProfile, isPending } = useUpdateMemberProfile();
  const [formData, setFormData] = useState<UpdateMemberProfileData>({
    name_bangla: memberProfile?.name_bangla || "",
    name_english: memberProfile?.name_english || "",
    father_husband_name: memberProfile?.father_husband_name || "",
    mother_name: memberProfile?.mother_name || "",
    user_date_of_birth: memberProfile?.user_date_of_birth || "",
    nid_number: memberProfile?.nid_number || "",
    academic_qualification: memberProfile?.academic_qualification || "",
    permanent_address: memberProfile?.permanent_address || "",
    present_address: memberProfile?.present_address || "",
    religion: memberProfile?.religion || "",
    gender: memberProfile?.gender || "",
    mobile: memberProfile?.mobile || "",
    alternate_mobile: memberProfile?.alternate_mobile || "",
    membership_type: memberProfile?.membership_type || "general",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile(
      { userId, data: formData },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update profile");
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#030712]">Edit Member Profile</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#030712]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#030712] mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Name (English)</label>
                <input
                  type="text"
                  name="name_english"
                  value={formData.name_english}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Name (Bangla)</label>
                <input
                  type="text"
                  name="name_bangla"
                  value={formData.name_bangla}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Father/Husband Name</label>
                <input
                  type="text"
                  name="father_husband_name"
                  value={formData.father_husband_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Mother's Name</label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="user_date_of_birth"
                  value={formData.user_date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">NID Number</label>
                <input
                  type="text"
                  name="nid_number"
                  value={formData.nid_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Education</label>
                <input
                  type="text"
                  name="academic_qualification"
                  value={formData.academic_qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Membership Type</label>
                <select
                  name="membership_type"
                  value={formData.membership_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                >
                  <option value="general">General</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#030712] mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Alternate Mobile</label>
                <input
                  type="text"
                  name="alternate_mobile"
                  value={formData.alternate_mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#030712] mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Present Address</label>
                <textarea
                  name="present_address"
                  value={formData.present_address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-1">Permanent Address</label>
                <textarea
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-[#030712] mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentUploadField
                label="Photo"
                field="photo"
                currentImage={memberProfile?.photo}
                onChange={handleFileChange}
              />
              <DocumentUploadField
                label="NID Front"
                field="nid_front_photo"
                currentImage={memberProfile?.nid_front_photo}
                onChange={handleFileChange}
              />
              <DocumentUploadField
                label="NID Back"
                field="nid_back_photo"
                currentImage={memberProfile?.nid_back_photo}
                onChange={handleFileChange}
              />
              <DocumentUploadField
                label="Signature"
                field="signature"
                currentImage={memberProfile?.signature}
                onChange={handleFileChange}
                isSignature
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#4A5565] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentUploadField({ 
  label, 
  field, 
  currentImage, 
  onChange,
  isSignature = false 
}: { 
  label: string; 
  field: string; 
  currentImage?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  isSignature?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${imagePath}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(e, field);
    }
  };

  const displayImage = preview || (currentImage ? getImageUrl(currentImage) : null);

  return (
    <div>
      <label className="block text-sm font-medium text-[#030712] mb-1">{label}</label>
      
      {displayImage && (
        <div className="mb-2">
          <img
            src={displayImage}
            alt={label}
            className={`w-full h-32 rounded-lg border border-[#E5E7EB] ${
              isSignature ? 'object-contain bg-white p-2' : 'object-cover'
            }`}
          />
          <p className="text-xs text-[#6B7280] mt-1">
            {preview ? 'New file selected' : 'Current file'}
          </p>
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] text-sm"
      />
      {!displayImage && (
        <p className="text-xs text-[#6B7280] mt-1">No file uploaded</p>
      )}
    </div>
  );
}
