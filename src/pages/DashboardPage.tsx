import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { ReadinessRing } from '../components/dashboard/ReadinessRing';
import { AreaCard } from '../components/dashboard/AreaCard';
import { ContinueCard } from '../components/dashboard/ContinueCard';
import { StreakWidget } from '../components/dashboard/StreakWidget';
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap';
import { StudyTimeTracker } from '../components/dashboard/StudyTimeTracker';
import { WeeklyBarChart } from '../components/dashboard/WeeklyBarChart';
import { useAppStore } from '../store/useAppStore';

export const DashboardPage: React.FC = () => {
  const { getAreaSummaries } = useAppStore();
  const areaSummaries = getAreaSummaries();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero / Header Panel */}
      <HeroBanner />

      {/* 2. Top Motivation Deck: Consistency Streak + 30-Day Activity Heatmap (SWAPPED TO BE ON TOP!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <StreakWidget />
        </div>
        <div className="lg:col-span-2">
          <ActivityHeatmap />
        </div>
      </div>

      {/* 3. Overall Readiness Ring + Continue Where You Left Off */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <ReadinessRing />
        </div>
        <div className="lg:col-span-2">
          <ContinueCard />
        </div>
      </div>

      {/* 4. Skill Areas Progress Cards (6 Segregated Focus Tracks) */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
              Focus Tracks
            </h2>
            <p className="text-xs text-navy-600/80 dark:text-cream-300/60">
              Systematic mastery across core algorithms, engineering, AI, systems, projects, and drives
            </p>
          </div>
          <span className="text-xs font-semibold text-coral-500">
            6 Tracks Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areaSummaries.map((summary) => (
            <AreaCard key={summary.id} summary={summary} />
          ))}
        </div>
      </div>

      {/* 5. Study Hours & Focus Timer (Pomodoro + Manual Prep Logging) */}
      <StudyTimeTracker />

      {/* 6. Target Internship & Hackathon Spotlight Banner */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral-500 text-white shadow-soft">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-[10px] font-bold text-coral-600 dark:bg-coral-950 dark:text-coral-300 uppercase tracking-wider">
                PDF Roadmap (26 Programs)
              </span>
              <span className="text-xs text-navy-600/70 dark:text-cream-300/50">
                Quarter-by-Quarter
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100 mt-0.5">
              Target Internship & Hackathon Opportunities
            </h3>
            <p className="text-xs text-navy-600/80 dark:text-cream-300/60 max-w-xl">
              Track 26 corporate recruitment drives (Google STEP, Microsoft Explore, Amazon SDE, Flipkart GRiD) and national research programs.
            </p>
          </div>
        </div>

        <Link
          to="/internships"
          className="inline-flex items-center gap-2 rounded-2xl bg-coral-500 px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral shrink-0 self-start sm:self-auto"
        >
          <span>Open Programs Roadmap</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 7. Weekly Velocity Bar Chart */}
      <WeeklyBarChart />
    </div>
  );
};
