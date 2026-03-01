import React from "react";

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Panel</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold mb-2">System Status</h2>
        <p className="text-gray-600">All systems operational.</p>
      </div>
    </div>
  );
}
