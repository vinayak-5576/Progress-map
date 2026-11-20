import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const WeeklyBarChart: React.FC = () => {
  const { getWeeklyActivity } = useAppStore();
  const weeklyData = getWeeklyActivity();
  const totalThisWeek = weeklyData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-500/10 text-coral-500 dark:bg-coral-500/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                Weekly Velocity
              </h2>
              <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
                Items completed over the last 7 days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-cream-200/80 px-2.5 py-1 text-xs font-semibold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-coral-500" />
            <span>{totalThisWeek} this week</span>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(20, 35, 59, 0.08)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#7599CC' }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#7599CC' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(242, 104, 91, 0.08)', radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-cream-300 bg-navy-900 px-3 py-2 text-xs text-cream-100 shadow-xl dark:border-navy-700">
                        <p className="font-semibold">{data.day} ({data.date})</p>
                        <p className="text-coral-400 mt-0.5">
                          {data.count} items completed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#F2685B"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-cream-200/70 dark:border-navy-800 flex items-center justify-between text-xs text-navy-600/70 dark:text-cream-300/50">
        <span>Average: {(totalThisWeek / 7).toFixed(1)} items / day</span>
        <span className="font-medium text-coral-500">Steady Pace</span>
      </div>
    </div>
  );
};
