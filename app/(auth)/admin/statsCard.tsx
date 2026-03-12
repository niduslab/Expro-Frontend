import {
  Users,
  FolderKanban,
  TrendingUp,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
export default function StatsCard() {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">1,847</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Projects
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">06</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">2 new</span>
            <span className="text-gray-400 ml-1">this quarter</span>
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Collections
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">৳24.5L</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet Balance
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                ৳8,42,000
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium">৳ 1.2L pending</span>
          </div>
        </div>
      </div>
    </>
  );
}
