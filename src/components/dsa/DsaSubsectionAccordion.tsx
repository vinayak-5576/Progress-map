import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DsaSubsection } from '../../types';
import { DsaItemRow } from './DsaItemRow';
import { useAppStore } from '../../store/useAppStore';

interface DsaSubsectionAccordionProps {
  subsection: DsaSubsection;
  searchQuery: string;
  statusFilter: string;
  hideCompleted: boolean;
  defaultExpanded?: boolean;
}

export const DsaSubsectionAccordion: React.FC<DsaSubsectionAccordionProps> = ({
  subsection,
  searchQuery,
  statusFilter,
  hideCompleted,
  defaultExpanded = true,
}) => {
  const { data } = useAppStore();
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // Compute completed count for this subsection
  const totalItems = subsection.items.length;
  const completedCount = subsection.items.filter((item) => {
    const userOverride = data?.dsaItems[item.id];
    const status = userOverride?.status || item.status;
    return status === 'completed';
  }).length;

  const percentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  const isAllDone = totalItems > 0 && completedCount === totalItems;

  // Filter items
  const filteredItems = subsection.items.filter((item) => {
    const userOverride = data?.dsaItems[item.id];
    const status = userOverride?.status || item.status;
    const notes = userOverride?.notes || item.notes || '';

    // Status filter
    if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }

    // Hide completed toggle
    if (hideCompleted && status === 'completed') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPractice = (item.links.practiceTitle || '').toLowerCase().includes(q);
      const matchNotes = notes.toLowerCase().includes(q);
      const matchDifficulty = (item.difficulty || '').toLowerCase().includes(q);
      if (!matchTitle && !matchPractice && !matchNotes && !matchDifficulty) {
        return false;
      }
    }

    return true;
  });

  // If search or filter is active and no items match, hide this subsection
  if (filteredItems.length === 0 && (searchQuery.trim() || statusFilter !== 'all' || hideCompleted)) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-cream-300/80 bg-cream-100/60 overflow-hidden dark:border-navy-800 dark:bg-navy-950/40 transition-colors">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 sm:px-4 text-left transition hover:bg-cream-200/50 dark:hover:bg-navy-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-coral-500 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-navy-400 shrink-0 dark:text-cream-400" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-sm sm:text-base font-bold text-navy-900 dark:text-cream-100 truncate">
                {subsection.title}
              </h4>
              {isAllDone && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-coral-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Completed</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="font-semibold text-navy-800 dark:text-cream-200">
              {completedCount} / {totalItems}
            </span>
            <span className="text-[10px] text-navy-600/70 dark:text-cream-300/50">
              {percentage}%
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="h-2 w-16 sm:w-20 overflow-hidden rounded-full bg-cream-300/70 dark:bg-navy-800">
            <div
              className="h-full rounded-full bg-coral-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <span className="rounded-lg bg-cream-200 px-2 py-0.5 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-cream-300">
            {filteredItems.length}
          </span>
        </div>
      </button>

      {/* Accordion Body: Items List */}
      {isOpen && (
        <div className="p-3 sm:p-4 pt-1 space-y-2 border-t border-cream-200/60 dark:border-navy-850">
          {filteredItems.map((item) => (
            <DsaItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
