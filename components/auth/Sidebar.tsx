import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8 px-2">
        <Link href="/dashboard" className="text-2xl font-bold">
          Expro<span className="text-blue-400">Admin</span>
        </Link>
      </div>
      <nav className="space-y-2">
        <Link 
          href="/dashboard" 
          className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin" 
          className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Admin Panel
        </Link>
        <Link 
          href="/" 
          className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors mt-8 text-gray-400 hover:text-white"
        >
          Back to Home
        </Link>
      </nav>
    </aside>
  );
}
