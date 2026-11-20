import React, { useState, useMemo } from 'react';
import {
  Binary,
  Search,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DsaSectionAccordion } from '../components/dsa/DsaSectionAccordion';
import { exportProgressToCsv } from '../lib/exportUtils';

export const DsaPage: React.FC = () => {
  const { dsaTracks, selectedTrackId, setSelectedTrackId, data } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [expandAllOverride, setExpandAllOverride] = useState<boolean | null>(null);

  const currentTrack = dsaTracks.find((t) => t.id === selectedTrackId) || dsaTracks[0];

  // Find which section is currently active / running
  const activeSectionId = useMemo(() => {
    if (!currentTrack) return null;

    let inProgressSecId: string | null = null;
    let firstUnfinishedSecId: string | null = null;

    for (const sec of currentTrack.sections) {
      let isSecDone = true;
      let hasSecInProgress = false;

      for (const sub of sec.subsections) {
        for (const item of sub.items) {
          const userOverride = data?.dsaItems[item.id];
          const status = userOverride?.status || item.status;
          if (status === 'in_progress') {
            hasSecInProgress = true;
          }
          if (status !== 'completed') {
            isSecDone = false;
          }
        }
      }

      if (hasSecInProgress && !inProgressSecId) {
        inProgressSecId = sec.id;
      }
      if (!isSecDone && !firstUnfinishedSecId) {
        firstUnfinishedSecId = sec.id;
      }
    }

    return inProgressSecId || firstUnfinishedSecId;
  }, [currentTrack, data?.dsaItems]);

  // Calculate live statistics for current track
  const trackStats = useMemo(() => {
    if (!currentTrack) {
      return { total: 0, completed: 0, inProgress: 0, pending: 0, percentage: 0 };
    }

    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    currentTrack.sections.forEach((sec) => {
      sec.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          total++;
          const override = data?.dsaItems[item.id];
          const st = override?.status || item.status || 'pending';
          if (st === 'completed') completed++;
          else if (st === 'in_progress') inProgress++;
          else pending++;
        });
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pending, percentage };
  }, [currentTrack, data]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setHideCompleted(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Track Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
            <Binary className="h-3.5 w-3.5" />
            <span>Problem Solving Matrix</span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
            DSA Problem Matrix
          </h1>
          <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
            Click any section or subsection to explore problem statements, LeetCode / GFG practice links,
            YouTube videos, articles, and personal notes.
          </p>
        </div>

        {/* Track switch tabs */}
        <div className="flex rounded-2xl border border-cream-300 bg-cream-50 p-1 dark:border-navy-800 dark:bg-navy-900 shadow-soft-sm shrink-0">
          {dsaTracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedTrackId === t.id
                  ? 'bg-navy-900 text-cream-100 shadow-sm dark:bg-coral-500 dark:text-navy-950'
                  : 'text-navy-700 hover:text-navy-950 dark:text-cream-300 dark:hover:text-cream-100'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Track Progress Overview Banner */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-900 dark:text-cream-100">
                {currentTrack?.title || 'Main DSA Course'}
              </h2>
              <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-xs font-bold text-coral-600 dark:bg-coral-950 dark:text-coral-300">
                {trackStats.percentage}% Ready
              </span>
            </div>
            <p className="text-xs text-navy-600/70 dark:text-cream-300/50 mt-1">
              {currentTrack?.sections.length || 0} Sections · {trackStats.total} Handpicked Problems
            </p>
          </div>

          {/* Quick numbers */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <div className="flex flex-col items-center">
              <span className="font-serif text-xl sm:text-2xl font-bold text-coral-500">
                {trackStats.completed}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                Completed
              </span>
            </div>

            <div className="h-8 w-px bg-cream-300 dark:bg-navy-800" />

            <div className="flex flex-col items-center">
              <span className="font-serif text-xl sm:text-2xl font-bold text-amber-500">
                {trackStats.inProgress}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                In Progress
              </span>
            </div>

            <div className="h-8 w-px bg-cream-300 dark:bg-navy-800" />

            <div className="flex flex-col items-center">
              <span className="font-serif text-xl sm:text-2xl font-bold text-navy-700 dark:text-cream-300">
                {trackStats.pending}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Coral progress bar */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800">
          <div
            className="h-full rounded-full bg-coral-500 transition-all duration-500 ease-out"
            style={{ width: `${trackStats.percentage}%` }}
          />
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between rounded-2xl border border-cream-300/80 bg-cream-50 p-3 shadow-soft-sm dark:border-navy-800 dark:bg-navy-900">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400 dark:text-cream-400" />
          <input
            type="text"
            placeholder="Search problems, LeetCode titles, topics, or your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-cream-100 pl-9 pr-3 py-2 text-xs text-navy-900 placeholder:text-navy-400 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 dark:placeholder:text-cream-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter buttons */}
          <div className="flex rounded-xl border border-cream-300 bg-cream-100 p-0.5 dark:border-navy-700 dark:bg-navy-850">
            {(['all', 'completed', 'in_progress', 'pending'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                  statusFilter === filter
                    ? 'bg-navy-900 text-cream-100 shadow-xs dark:bg-coral-500 dark:text-navy-950'
                    : 'text-navy-700 hover:text-navy-950 dark:text-cream-300'
                }`}
              >
                {filter === 'in_progress' ? 'In Progress' : filter}
              </button>
            ))}
          </div>

          {/* Hide completed toggle */}
          <button
            type="button"
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              hideCompleted
                ? 'border-coral-300 bg-coral-50 text-coral-600 dark:border-coral-800 dark:bg-coral-950/50 dark:text-coral-300'
                : 'border-cream-300 bg-cream-100 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300'
            }`}
          >
            {hideCompleted ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>Hide Completed</span>
          </button>

          {/* Expand/Collapse All */}
          <button
            type="button"
            onClick={() => {
              if (expandAllOverride === true) {
                setExpandAllOverride(false);
              } else {
                setExpandAllOverride(true);
              }
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300 transition"
            title={expandAllOverride === true ? 'Collapse All Sections' : 'Expand All Sections'}
          >
            {expandAllOverride === true ? (
              <ChevronUp className="h-3.5 w-3.5 text-coral-500" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {expandAllOverride === true ? 'Collapse All' : 'Expand All'}
            </span>
          </button>

          {/* Download CSV Progress */}
          <button
            type="button"
            onClick={() => {
              if (data) exportProgressToCsv(data, dsaTracks);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:border-coral-400 hover:text-coral-600 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-200 dark:hover:border-coral-500 transition shadow-xs"
            title="Download full progress report as CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5 text-coral-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Active filter summary pill */}
      {(searchQuery || statusFilter !== 'all' || hideCompleted || expandAllOverride !== null) && (
        <div className="flex items-center justify-between px-2 text-xs text-navy-600/80 dark:text-cream-300/60">
          <div className="flex items-center gap-2">
            <span>Filtering by:</span>
            {searchQuery && (
              <span className="rounded-md bg-coral-100 px-2 py-0.5 font-semibold text-coral-700 dark:bg-coral-950/60 dark:text-coral-300">
                "{searchQuery}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="rounded-md bg-cream-200 px-2 py-0.5 font-semibold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
                Status: {statusFilter}
              </span>
            )}
            {hideCompleted && (
              <span className="rounded-md bg-cream-200 px-2 py-0.5 font-semibold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
                Hidden completed
              </span>
            )}
            {expandAllOverride !== null && (
              <span className="rounded-md bg-cream-200 px-2 py-0.5 font-semibold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
                View: {expandAllOverride ? 'All Expanded' : 'All Collapsed'}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              handleResetFilters();
              setExpandAllOverride(null);
            }}
            className="inline-flex items-center gap-1 font-semibold text-coral-500 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset filters & smart view</span>
          </button>
        </div>
      )}

      {/* 4. Collapsible Sections Tree */}
      <div className="space-y-4">
        {currentTrack?.sections.map((sec, idx) => {
          const isSecActive = sec.id === activeSectionId;
          const shouldExpandSec =
            expandAllOverride !== null
              ? expandAllOverride
              : searchQuery.trim()
              ? true
              : isSecActive;

          return (
            <DsaSectionAccordion
              key={`${currentTrack.id}-${sec.id}-${expandAllOverride ?? 'smart'}`}
              section={sec}
              sectionIndex={idx}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              hideCompleted={hideCompleted}
              defaultExpanded={shouldExpandSec}
              expandAllOverride={expandAllOverride}
            />
          );
        })}
      </div>
    </div>
  );
};
