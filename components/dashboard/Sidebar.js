'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FolderKanban, TrendingUp, Sparkles, Activity, Settings, 
  LogOut, Lightbulb, PlusCircle, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function Sidebar({ activeView, setActiveView, totalCount = 0 }) {
  const { data: session } = useSession();

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Ideas Portfolio', icon: FolderKanban, count: totalCount },
    { id: 'trends', label: 'Market Velocity', icon: TrendingUp, badge: 'Live' },
    { id: 'suggestions', label: 'AI Opportunities', icon: Sparkles, badge: 'New' },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 no-print">
      
      {/* Sticky Container */}
      <div className="lg:sticky lg:top-24 space-y-6">
        
        {/* Brand Card */}
        <div className="glass-card rounded-[20px] p-5 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-violet to-accent-cyan flex items-center justify-center text-white shadow-glow-primary font-bold">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Analyst <span className="text-brand-400">OS</span>
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="AI Analyst Engine Connected" />
          </div>

          <Link href="/">
            <Button variant="shiny" size="sm" icon={PlusCircle} className="w-full text-xs font-bold py-2.5">
              New Validation
            </Button>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="glass-card rounded-[20px] p-3 border-slate-200 dark:border-slate-800 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Navigation
          </div>
          
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-glow-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile Card */}
        {session && (
          <div className="glass-card rounded-[20px] p-4 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {session.user?.name || 'Pro Founder'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {session.user?.email}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Enterprise Tier
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
