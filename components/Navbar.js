'use client';

import Link from 'next/link';
import { Lightbulb, LayoutDashboard, Moon, Sun, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">
              IdeaValidator AI
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="hidden sm:flex items-center space-x-1">
                    <UserIcon className="w-4 h-4" />
                    <span>{session.user?.name || 'User'}</span>
                  </span>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
