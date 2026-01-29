'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Home, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Sprinto Library
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-baseline space-x-4">
              <NavLink href="/" icon={<Home size={18} />}>Home</NavLink>
              <NavLink href="/books" icon={<BookOpen size={18} />}>Books</NavLink>
              <NavLink href="/authors" icon={<Users size={18} />}>Authors</NavLink>
            </div>

            <div className="border-l border-slate-700 pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/10 transition-all duration-200 group"
                  >
                    <LogOut size={18} className="group-hover:text-red-400" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all duration-200 group"
                >
                  <LogIn size={18} className="group-hover:text-indigo-400" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      {icon}
      {children}
    </Link>
  );
}
