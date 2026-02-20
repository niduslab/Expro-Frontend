import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-600">Summary of your account activity.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p className="text-gray-600">View detailed reports and analytics.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">Manage your account preferences.</p>
        </div>
      </div>
    </div>
  );
}
