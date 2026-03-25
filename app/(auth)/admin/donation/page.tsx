"use client";

import { useState } from "react";
import { useDonations } from "@/lib/hooks/admin/useDonations";

export default function DonationList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useDonations(page);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500">Loading donations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500">Failed to load donations</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500">No donations found</p>
      </div>
    );
  }

  const { current_page, last_page } = data.pagination;

  return (
    <div className="bg-white text-black rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Donations</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Donor</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Currency</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="">
            {data.data.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{donation.donor_name}</td>
                <td className="px-6 py-4">{donation.donor_email}</td>
                <td className="px-6 py-4 font-medium">{donation.amount}</td>
                <td className="px-6 py-4">{donation.currency}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      donation.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : donation.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {donation.status}
                  </span>
                </td>

                <td className="px-6 py-4">{donation.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
        <button
          disabled={current_page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {current_page} of {last_page}
        </span>

        <button
          disabled={current_page === last_page}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
