import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600">
          Expro
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Log In</Button>
          </Link>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
