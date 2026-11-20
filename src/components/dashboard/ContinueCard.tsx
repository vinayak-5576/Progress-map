import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ContinueCard: React.FC = () => {
  const { getContinueRecommendation } = useAppStore();
  const rec = getContinueRecommendation();

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-100 text-coral-600 dark:bg-coral-950/60 dark:text-coral-400">
              <PlayCircle className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-navy-600/80 dark:text-cream-300/60">
              Continue Where You Left Off
            </span>
          </div>

          <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-cream-300">
            {rec.tag}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-serif text-xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
            {rec.title}
          </h3>
          <p className="mt-1 text-xs text-navy-600/80 dark:text-cream-300/60">
            {rec.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-cream-200/70 dark:border-navy-800 flex items-center justify-between">
        <span className="text-xs font-medium text-navy-600/70 dark:text-cream-300/50">
          Focus: 1 item at a time
        </span>

        <Link
          to={rec.route}
          className="inline-flex items-center gap-2 rounded-2xl bg-coral-500 px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral"
        >
          <span>{rec.actionLabel || 'Resume Topic'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
