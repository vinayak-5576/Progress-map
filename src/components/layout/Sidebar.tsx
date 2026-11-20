import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Binary,
  Code2,
  Sparkles,
  BookOpen,
  FolderGit2,
  Briefcase,
  Settings,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  weight?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'DSA Practice', path: '/dsa', icon: Binary, weight: '35%' },
  { name: 'Development', path: '/development', icon: Code2, weight: '25%' },
  { name: 'AI & AI Tools', path: '/ai-tools', icon: Sparkles, weight: '20%' },
  { name: 'CS Fundamentals', path: '/cs-fundamentals', icon: BookOpen, weight: '10%' },
  { name: 'Flagship Projects', path: '/projects', icon: FolderGit2, weight: '5%' },
  { name: 'Internships & Drives', path: '/internships', icon: Briefcase, weight: '5%' },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { getOverallReadiness, getAreaSummaries } = useAppStore();
  const overall = getOverallReadiness();
  const summaries = getAreaSummaries();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between border-r border-cream-300/80 bg-cream-50/70 p-4 dark:border-navy-800 dark:bg-navy-900/60 transition-colors">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/50">
            Preparation Tracks
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const summary = summaries.find(
                (s) =>
                  (item.path === '/dsa' && s.id === 'dsa') ||
                  (item.path === '/development' && s.id === 'development') ||
                  (item.path === '/ai-tools' && s.id === 'ai-tools') ||
                  (item.path === '/cs-fundamentals' && s.id === 'cs-fundamentals') ||
                  (item.path === '/projects' && s.id === 'projects') ||
                  (item.path === '/internships' && s.id === 'internships')
              );

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-navy-900 text-cream-100 shadow-soft dark:bg-navy-800 dark:text-coral-400'
                        : 'text-navy-700 hover:bg-cream-200/80 hover:text-navy-950 dark:text-cream-300 dark:hover:bg-navy-850 dark:hover:text-cream-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? 'bg-coral-500 text-white'
                              : 'bg-cream-200/80 text-navy-700 group-hover:bg-cream-300/80 group-hover:text-navy-950 dark:bg-navy-800 dark:text-cream-300 dark:group-hover:bg-navy-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {summary !== undefined && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-navy-800 text-coral-400 dark:bg-navy-900 dark:text-coral-400'
                                : 'bg-cream-200 text-navy-600 dark:bg-navy-800 dark:text-cream-300'
                            }`}
                          >
                            {summary.percentage}%
                          </span>
                        )}
                        {item.weight && summary === undefined && (
                          <span className="text-[10px] text-navy-600/60 dark:text-cream-300/40">
                            {item.weight}
                          </span>
                        )}
                        <ChevronRight
                          className={`h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 ${
                            isActive ? 'text-coral-400 opacity-100' : 'text-navy-400 dark:text-cream-400'
                          }`}
                        />
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Summary Card */}
      <div className="rounded-2xl border border-cream-300/80 bg-cream-100/90 p-4 shadow-soft-sm dark:border-navy-800 dark:bg-navy-850/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-coral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800 dark:text-cream-200">
              Readiness Score
            </span>
          </div>
          <span className="font-serif text-lg font-bold text-coral-500">{overall}%</span>
        </div>

        {/* Mini progress bar */}
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-900">
          <div
            className="h-full rounded-full bg-coral-500 transition-all duration-500"
            style={{ width: `${overall}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] leading-tight text-navy-600/80 dark:text-cream-300/60">
          Targeting 85%+ readiness for upcoming top-tier off-campus & campus drives.
        </p>
      </div>
    </aside>
  );
};
