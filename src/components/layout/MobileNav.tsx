import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Binary,
  Code2,
  Sparkles,
  MoreHorizontal,
  BookOpen,
  FolderGit2,
  Briefcase,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MobileNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { getOverallReadiness } = useAppStore();
  const overall = getOverallReadiness();

  const primaryTabs = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'DSA', path: '/dsa', icon: Binary },
    { name: 'Dev', path: '/development', icon: Code2 },
    { name: 'AI & Tools', path: '/ai-tools', icon: Sparkles },
  ];

  const moreItems = [
    { name: 'Flagship Projects', path: '/projects', icon: FolderGit2, desc: 'Portfolio builds, GitHub repos & live demos' },
    { name: 'Internships & Drives', path: '/internships', icon: Briefcase, desc: '26 PDF roadmap programs & active applications' },
    { name: 'CS Fundamentals', path: '/cs-fundamentals', icon: BookOpen, desc: 'OS, DBMS, CN, OOP, LLD/HLD' },
    { name: 'Settings & Data Backup', path: '/settings', icon: Settings, desc: 'Export/import JSON, reset progress' },
  ];

  return (
    <>
      {/* More items drawer / overlay */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="relative z-10 w-full rounded-t-3xl border-t border-cream-300 bg-cream-50 p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200 dark:border-navy-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                  Additional Tracks
                </h3>
                <p className="text-xs text-navy-600/80 dark:text-cream-300/60">
                  Readiness: <span className="font-semibold text-coral-500">{overall}%</span> overall
                </p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="rounded-full p-1.5 text-navy-600 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-navy-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 rounded-2xl p-3 transition ${
                        isActive
                          ? 'bg-coral-50 text-coral-600 border border-coral-200 dark:bg-coral-950/40 dark:text-coral-400 dark:border-coral-800'
                          : 'bg-cream-100 text-navy-900 hover:bg-cream-200 dark:bg-navy-850 dark:text-cream-100 dark:hover:bg-navy-800'
                      }`
                    }
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-500/10 text-coral-500 dark:bg-coral-500/20 dark:text-coral-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-navy-600/70 dark:text-cream-300/50">{item.desc}</div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-cream-300/80 bg-cream-100/95 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/95 px-2 py-1.5 shadow-lg pb-safe"
      >
        <div className="flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.path === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-150 min-w-[56px] ${
                    isActive
                      ? 'text-coral-500 font-bold scale-105'
                      : 'text-navy-600 hover:text-navy-900 dark:text-cream-300 dark:hover:text-cream-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-coral-100 dark:bg-coral-950/50' : 'bg-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-navy-600 hover:text-navy-900 dark:text-cream-300 dark:hover:text-cream-100 min-w-[56px] transition-all"
            aria-label="More navigation links"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
