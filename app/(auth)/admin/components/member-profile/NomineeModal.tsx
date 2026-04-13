"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateNominee, useUpdateNominee, NomineeFormData, Nominee } from "@/lib/hooks/admin/useMembers";
import { toast } from "sonner";

interface NomineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  nominee?: Nominee | null;
}

export default function NomineeModal({ isOpen, onClose, userId, nominee }: NomineeModalProps) {
  const { mutate: createNominee, isPending: isCreating } = useCreateNominee();
  const { mutate: updateNominee, isPending: isUpdating } = useUpdateNominee();
  const isPending = isCreating || isUpdating;

  const [formData, setFormData] = useState<NomineeFormData>({
    nominee_name_bangla: "",
    nominee_name_english: "",
    relation: "",
    percentage: 0,
    nominee_mobile: "",
    nominee_nid_number: "",
    nominee_date_of_birth: "",
    address: "",
    is_active: true,
    is_primary: false,
  });

  useEffect(() => {
    if (nominee) {
      setFormData({
        nominee_name_bangla: nominee.nominee_name_bangla,
        nominee_name_english: nominee.nominee_name_english,
        relation: nominee.relation,
        percentage: nominee.percentage,
        nominee_mobile: nominee.nominee_mobile || "",
        nominee_nid_number: nominee.nominee_nid_number || "",
        nominee_date_of_birth: nominee.nominee_date_of_birth || "",
        address: nominee.address || "",
        is_active: nominee.is_active,
        is_primary: nominee.is_primary,
      });
    } else {
      setFormData({
        nominee_name_bangla: "",
        nominee_name_english: "",
        relation: "",
        percentage: 0,
        nominee_mobile: "",
        nominee_nid_number: "",
        nominee_date_of_birth: "",
        address: "",
        is_active: true,
        is_primary: false,
      });
    }
  }, [nominee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nominee) {
      updateNominee(
        { userId, nomineeId: nominee.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Nominee updated successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update nominee");
          },
        }
      );
    } else {
      createNominee(
        { userId, data: formData },
        {
          onSuccess: () => {
            toast.success("Nominee created successfully");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create nominee");
          },
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'percentage') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#030712]">
            {nominee ? "Edit Nominee" : "Add Nominee"}
          </h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#030712]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nominee_name_english"
                value={formData.nominee_name_english}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">
                Name (Bangla) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nominee_name_bangla"
                value={formData.nominee_name_bangla}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">
                Relation <span className="text-red-500">*</span>
              </label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              >
                <option value="">Select Relation</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">Mobile</label>
              <input
                type="text"
                name="nominee_mobile"
                value={formData.nominee_mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">NID Number</label>
              <input
                type="text"
                name="nominee_nid_number"
                value={formData.nominee_nid_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030712] mb-1">Date of Birth</label>
              <input
                type="date"
                name="nominee_date_of_birth"
                value={formData.nominee_date_of_birth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#030712] mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-[#068847] border-[#E5E7EB] rounded focus:ring-[#068847]"
              />
              <span className="text-sm text-[#030712]">Active</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleChange}
                className="w-4 h-4 text-[#068847] border-[#E5E7EB] rounded focus:ring-[#068847]"
              />
              <span className="text-sm text-[#030712]">Primary Nominee</span>
            </label>
          </div>

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
              {isPending ? "Saving..." : nominee ? "Update Nominee" : "Add Nominee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
