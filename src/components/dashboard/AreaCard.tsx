import React from 'react';
import { Link } from 'react-router-dom';
import {
  Binary,
  Code2,
  Sparkles,
  BookOpen,
  Briefcase,
  FolderGit2,
  ArrowUpRight,
} from 'lucide-react';
import { AreaProgressSummary } from '../../types';

interface AreaCardProps {
  summary: AreaProgressSummary;
}

const iconMap: Record<string, React.ElementType> = {
  Binary,
  Code2,
  Sparkles,
  BookOpen,
  Briefcase,
  FolderGit2,
};

export const AreaCard: React.FC<AreaCardProps> = ({ summary }) => {
  const Icon = iconMap[summary.icon] || Binary;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-navy-800 dark:bg-navy-900">
      <div>
        {/* Header row: Icon & Weight */}
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-200 text-navy-800 transition-colors group-hover:bg-coral-500 group-hover:text-white dark:bg-navy-800 dark:text-cream-200 dark:group-hover:bg-coral-500">
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full border border-cream-300 bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-navy-600 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300">
            {Math.round(summary.weight * 100)}% weight
          </span>
        </div>

        {/* Title & metrics */}
        <div className="mt-4">
          <h3 className="font-serif text-xl font-bold tracking-tight text-navy-900 dark:text-cream-100 group-hover:text-coral-500 transition-colors">
            {summary.title}
          </h3>

          <div className="mt-2 flex items-baseline justify-between text-xs text-navy-600/80 dark:text-cream-300/60">
            <span>Progress Completed</span>
            <span className="font-bold text-navy-900 dark:text-cream-100">
              {summary.completed} / {summary.total} units
            </span>
          </div>

          {/* Progress bar with coral fill */}
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800">
            <div
              className="h-full rounded-full bg-coral-500 transition-all duration-500 ease-out"
              style={{ width: `${summary.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-cream-200/70 dark:border-navy-800">
        <span className="font-serif text-2xl font-extrabold text-navy-900 dark:text-cream-100">
          {summary.percentage}%
        </span>

        <Link
          to={summary.route}
          className="inline-flex items-center gap-1.5 rounded-xl bg-cream-200/80 px-3 py-1.5 text-xs font-semibold text-navy-800 transition hover:bg-coral-500 hover:text-white dark:bg-navy-800 dark:text-cream-200 dark:hover:bg-coral-500"
        >
          <span>Open Track</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
