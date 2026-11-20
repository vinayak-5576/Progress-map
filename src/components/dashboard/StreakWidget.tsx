import React from 'react';
import { Flame, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const StreakWidget: React.FC = () => {
  const { getCurrentStreak, get30DayActivity } = useAppStore();
  const streak = getCurrentStreak();
  const activityData = get30DayActivity();
  const activeDays = activityData.filter((d) => d.count > 0).length;

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-coral-200/80 bg-coral-50/50 p-6 shadow-soft dark:border-coral-900/40 dark:bg-coral-950/20 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-coral-200/50 dark:border-coral-900/30">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500 text-white shadow-soft">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-navy-900 dark:text-cream-100">
              Consistency Streak
            </h3>
            <p className="text-[11px] text-navy-600/70 dark:text-cream-300/50">
              Daily habit compounding
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-coral-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
          <ShieldCheck className="h-3 w-3" />
          Active
        </span>
      </div>

      <div className="my-4 flex items-center justify-around text-center">
        <div>
          <span className="font-serif text-4xl sm:text-5xl font-extrabold text-coral-500">
            {streak}
          </span>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy-700 dark:text-cream-200">
            Current Days
          </p>
        </div>

        <div className="h-12 w-px bg-coral-200 dark:bg-coral-900/50" />

        <div>
          <span className="font-serif text-4xl sm:text-5xl font-extrabold text-navy-900 dark:text-cream-100">
            {activeDays}
          </span>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy-700 dark:text-cream-200">
            This Month
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-coral-200/50 dark:border-coral-900/30 text-xs text-navy-700/80 dark:text-cream-300/70 text-center">
        {streak >= 7
          ? '🔥 Incredible momentum! Keep pushing through interview season.'
          : 'Complete at least 1 problem or concept today to maintain your streak.'}
      </div>
    </div>
  );
};
