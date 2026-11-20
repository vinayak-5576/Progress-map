import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ActivityHeatmap: React.FC = () => {
  const { get30DayActivity } = useAppStore();
  const activityData = get30DayActivity();

  const totalCompletions = activityData.reduce((acc, curr) => acc + curr.count, 0);
  const activeDays = activityData.filter((d) => d.count > 0).length;

  const getColorClass = (count: number) => {
    if (count === 0) {
      return 'bg-cream-200/80 dark:bg-navy-800 border border-cream-300/40 dark:border-navy-700/50';
    }
    if (count === 1) {
      return 'bg-coral-100 dark:bg-coral-950/70 text-coral-800 dark:text-coral-300 border border-coral-200 dark:border-coral-900';
    }
    if (count === 2) {
      return 'bg-coral-300 dark:bg-coral-800 text-coral-950 border border-coral-400';
    }
    if (count <= 4) {
      return 'bg-coral-400 dark:bg-coral-600 text-white border border-coral-500';
    }
    return 'bg-coral-500 text-white shadow-sm border border-coral-600';
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/10 text-coral-500 dark:bg-coral-500/20">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                30-Day Activity Heatmap
              </h2>
              <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
                Consistency across practice and builds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-coral-500">{activeDays}</span>
            <span className="text-navy-600/70 dark:text-cream-300/60">/ 30 active days</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mt-5">
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {activityData.map((item) => (
              <div
                key={item.date}
                className={`group relative flex flex-col items-center justify-center h-9 rounded-xl transition-all hover:scale-110 cursor-pointer ${getColorClass(
                  item.count
                )}`}
              >
                <span className="text-[10px] font-semibold opacity-70 group-hover:opacity-100">
                  {new Date(item.date).getDate()}
                </span>

                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-full mb-2 hidden -translate-x-1/2 left-1/2 whitespace-nowrap rounded-lg bg-navy-900 px-2.5 py-1 text-[11px] font-medium text-cream-100 shadow-xl group-hover:block z-30 dark:bg-cream-100 dark:text-navy-950">
                  <span className="font-bold">{item.date}</span>: {item.count} items completed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Footer & Legend */}
      <div className="mt-6 pt-4 border-t border-cream-200/70 dark:border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs text-navy-600/70 dark:text-cream-300/50">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-coral-500" />
          <span>
            Total: <strong className="text-navy-900 dark:text-cream-100">{totalCompletions}</strong> completed items
          </span>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">Less</span>
          <span className="h-2.5 w-2.5 rounded bg-cream-200 border border-cream-300 dark:bg-navy-800" />
          <span className="h-2.5 w-2.5 rounded bg-coral-100 dark:bg-coral-950/70" />
          <span className="h-2.5 w-2.5 rounded bg-coral-300 dark:bg-coral-800" />
          <span className="h-2.5 w-2.5 rounded bg-coral-400 dark:bg-coral-600" />
          <span className="h-2.5 w-2.5 rounded bg-coral-500" />
          <span className="text-[10px]">More</span>
        </div>
      </div>
    </div>
  );
};
