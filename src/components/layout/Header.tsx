import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Flame,
  Sun,
  Moon,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const {
    data,
    toggleTheme,
    getCurrentStreak,
    getOverallReadiness,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useAppStore();
  const streak = getCurrentStreak();
  const readiness = getOverallReadiness();
  const isDark = data?.theme === 'dark';
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cream-300/70 bg-cream-100/90 backdrop-blur-md dark:border-navy-800 dark:bg-navy-950/90 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo & Sidebar Collapse Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebarCollapsed}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 bg-cream-50 text-navy-700 hover:border-coral-400 hover:text-coral-600 dark:border-navy-800 dark:bg-navy-900 dark:text-cream-300 dark:hover:border-coral-500 dark:hover:text-coral-400 transition"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          <Link
            to="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 rounded-lg p-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-cream-100 shadow-soft transition-transform group-hover:scale-105 dark:bg-coral-500 dark:text-navy-950">
              <Compass className="h-5 w-5 text-coral-500 dark:text-navy-950 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-navy-900 dark:text-cream-100">
                  PrepTracker
                </span>
                <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[10px] font-semibold text-coral-600 dark:bg-coral-500/20 dark:text-coral-300">
                  Daily
                </span>
              </div>
              <p className="hidden text-xs text-navy-600/80 dark:text-cream-300/60 sm:block">
                Placement & Internship Engine
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Metrics & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-coral-200 bg-coral-50/80 px-3 py-1 text-xs font-semibold text-coral-600 shadow-sm dark:border-coral-900/60 dark:bg-coral-950/40 dark:text-coral-300"
            title={`${streak} consecutive active days`}
          >
            <Flame className="h-4 w-4 fill-coral-500 text-coral-500 animate-pulse" />
            <span>{streak} day streak</span>
          </div>

          {/* Overall readiness pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-navy-200/80 bg-cream-200/70 px-3 py-1 text-xs font-medium text-navy-800 dark:border-navy-800 dark:bg-navy-900 dark:text-cream-200">
            <span className="h-2 w-2 rounded-full bg-coral-500"></span>
            <span>Readiness:</span>
            <span className="font-bold text-navy-900 dark:text-cream-100">{readiness}%</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-300 bg-cream-50 text-navy-700 transition hover:border-coral-400 hover:text-coral-600 dark:border-navy-800 dark:bg-navy-900 dark:text-cream-300 dark:hover:border-coral-500 dark:hover:text-coral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            aria-label="Toggle color theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Settings link */}
          <Link
            to="/settings"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
              location.pathname === '/settings'
                ? 'border-coral-500 bg-coral-50 text-coral-600 dark:border-coral-500 dark:bg-coral-950/40 dark:text-coral-400'
                : 'border-cream-300 bg-cream-50 text-navy-700 hover:border-coral-400 hover:text-coral-600 dark:border-navy-800 dark:bg-navy-900 dark:text-cream-300 dark:hover:border-coral-500 dark:hover:text-coral-400'
            }`}
            title="Settings & Export"
            aria-label="Settings and Data Export"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
