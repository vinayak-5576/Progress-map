import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Folder, FolderOpen } from 'lucide-react';
import { DsaSection } from '../../types';
import { DsaSubsectionAccordion } from './DsaSubsectionAccordion';
import { useAppStore } from '../../store/useAppStore';

interface DsaSectionAccordionProps {
  section: DsaSection;
  sectionIndex: number;
  searchQuery: string;
  statusFilter: string;
  hideCompleted: boolean;
  defaultExpanded?: boolean;
}

export const DsaSectionAccordion: React.FC<DsaSectionAccordionProps> = ({
  section,
  sectionIndex,
  searchQuery,
  statusFilter,
  hideCompleted,
  defaultExpanded = true,
}) => {
  const { data } = useAppStore();
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // Compute total items and completed items across all subsections in this section
  let totalItems = 0;
  let completedItems = 0;

  section.subsections.forEach((sub) => {
    sub.items.forEach((item) => {
      totalItems++;
      const userOverride = data?.dsaItems[item.id];
      const status = userOverride?.status || item.status;
      if (status === 'completed') {
        completedItems++;
      }
    });
  });

  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const isSectionDone = totalItems > 0 && completedItems === totalItems;

  return (
    <div className="rounded-3xl border border-cream-300/80 bg-cream-50 shadow-soft overflow-hidden dark:border-navy-800 dark:bg-navy-900 transition-colors">
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition hover:bg-cream-100/60 dark:hover:bg-navy-850 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cream-200 text-navy-800 dark:bg-navy-800 dark:text-cream-200">
            {isOpen ? <FolderOpen className="h-5 w-5 text-coral-500" /> : <Folder className="h-5 w-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-coral-500">
                Section {sectionIndex + 1}
              </span>
              {isSectionDone && (
                <span className="flex items-center gap-1 rounded-full bg-coral-100 px-2 py-0.5 text-[10px] font-bold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mastered</span>
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-navy-900 dark:text-cream-100 truncate">
              {section.title}
            </h3>
          </div>
        </div>

        {/* Right: Progress & Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-xs sm:text-sm font-bold text-navy-900 dark:text-cream-100">
              {completedItems} / {totalItems}
            </span>
            <span className="text-[10px] text-navy-600/70 dark:text-cream-300/50">
              {percentage}% done
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-20 sm:w-28 overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800">
            <div
              className="h-full rounded-full bg-coral-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cream-100 text-navy-600 dark:bg-navy-800 dark:text-cream-300">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-coral-500" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </button>

      {/* Subsections list */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-cream-200/70 dark:border-navy-800/80">
          {section.subsections.map((sub) => (
            <DsaSubsectionAccordion
              key={sub.id}
              subsection={sub}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              hideCompleted={hideCompleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
