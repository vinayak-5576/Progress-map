import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Target } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ReadinessRing: React.FC = () => {
  const { getOverallReadiness, getAreaSummaries } = useAppStore();
  const overall = getOverallReadiness();
  const summaries = getAreaSummaries();

  // Color mapping based strictly on Navy/Cream/Coral palette
  const chartData = summaries.map((s) => ({
    name: s.title,
    value: s.percentage * s.weight,
    rawPercentage: s.percentage,
    weight: Math.round(s.weight * 100),
    fill:
      s.id === 'dsa'
        ? '#F2685B' // Coral primary
        : s.id === 'development'
        ? '#3A5C8E' // Navy 600
        : s.id === 'ai-tools'
        ? '#5277AD' // Navy 500
        : s.id === 'cs-fundamentals'
        ? '#7599CC' // Navy 400
        : s.id === 'projects'
        ? '#2A456E' // Navy 700
        : '#1E3252', // Navy 800
  }));

  // Empty placeholder slice if overall < 100
  const remaining = Math.max(0, 100 - overall);
  const pieData = [
    ...chartData,
    {
      name: 'Remaining to Target',
      value: remaining,
      rawPercentage: remaining,
      weight: 0,
      fill: 'rgba(20, 35, 59, 0.08)',
      isRemaining: true,
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors h-full">
      <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/10 text-coral-500 dark:bg-coral-500/20">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
              Overall Readiness
            </h2>
            <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
              Weighted across all 5 skill areas
            </p>
          </div>
        </div>

        <span className="rounded-full bg-coral-100 px-2.5 py-1 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
          Target: 85%+
        </span>
      </div>

      {/* Main Ring Gauge */}
      <div className="relative my-3 flex h-44 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={88}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  if (data.isRemaining) return null;
                  return (
                    <div className="rounded-xl border border-cream-300 bg-navy-900 px-3 py-2 text-xs text-cream-100 shadow-xl dark:border-navy-700">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-coral-400 mt-0.5">
                        {data.rawPercentage}% complete (Weight: {data.weight}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center score label */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="font-serif text-4xl sm:text-5xl font-extrabold text-navy-900 dark:text-cream-100 tracking-tight">
            {overall}
            <span className="text-2xl text-coral-500 font-sans">%</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
            Readiness
          </span>
        </div>
      </div>

      {/* Area breakdown list: 2-column compact grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-3 border-t border-cream-200 dark:border-navy-800">
        {summaries.map((s) => (
          <div key={s.id} className="flex items-center justify-between text-xs min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    s.id === 'dsa'
                      ? '#F2685B'
                      : s.id === 'development'
                      ? '#3A5C8E'
                      : s.id === 'ai-tools'
                      ? '#5277AD'
                      : s.id === 'cs-fundamentals'
                      ? '#7599CC'
                      : s.id === 'projects'
                      ? '#2A456E'
                      : '#1E3252',
                }}
              />
              <span className="font-medium text-navy-800 dark:text-cream-200 truncate">{s.title}</span>
            </div>
            <span className="font-bold text-navy-900 dark:text-cream-100 shrink-0 ml-1.5">{s.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
