"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { InfoItem } from "./shared";
import NomineeModal from "./NomineeModal";
import { useDeleteNominee, Nominee } from "@/lib/hooks/admin/useMembers";
import { toast } from "sonner";

interface NomineesTabProps {
  nominees: any[];
  userId: number;
}

export default function NomineesTab({ nominees, userId }: NomineesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const { mutate: deleteNominee } = useDeleteNominee();

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedNominee(null);
    setIsModalOpen(true);
  };

  const handleDelete = (nomineeId: number) => {
    if (confirm("Are you sure you want to delete this nominee?")) {
      deleteNominee(
        { userId, nomineeId },
        {
          onSuccess: () => {
            toast.success("Nominee deleted successfully");
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete nominee");
          },
        }
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNominee(null);
  };
  return (
    <>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[#030712]">Nominees</h3>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Nominee
          </button>
        </div>

        {!nominees || nominees.length === 0 ? (
          <p className="text-center text-[#6B7280] py-8">No nominees found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nominees.map((nominee: any) => (
              <div key={nominee.id} className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-[#030712]">{nominee.nominee_name_english}</h4>
                    {nominee.is_primary && (
                      <span className="px-3 py-1 bg-[#068847] text-white rounded-full text-xs font-medium">Primary</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(nominee)}
                      className="p-2 text-[#068847] hover:bg-[#068847]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(nominee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
            <div className="space-y-3">
              <InfoItem label="Name (Bangla)" value={nominee.nominee_name_bangla} />
              <InfoItem label="Date of Birth" value={
                nominee.nominee_date_of_birth 
                  ? new Date(nominee.nominee_date_of_birth).toLocaleDateString() 
                  : "N/A"
              } />
              <InfoItem label="Relation" value={nominee.relation} />
              <InfoItem label="Percentage" value={`${nominee.percentage}%`} />
              <InfoItem label="NID Number" value={nominee.nominee_nid_number || "N/A"} />
              <InfoItem label="Mobile" value={nominee.nominee_mobile || "N/A"} />
              {nominee.address && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Address</p>
                  <p className="text-sm text-[#030712]">{nominee.address}</p>
                </div>
              )}
              <InfoItem label="Status" value={
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  nominee.is_active ? "bg-[#CCFBF1] text-[#0D9488]" : "bg-[#F3F4F6] text-gray-700"
                }`}>
                  {nominee.is_active ? "Active" : "Inactive"}
                </span>
              } />
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <NomineeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
        nominee={selectedNominee}
      />
    </>
  );
}
