import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Flame, Target } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const HeroBanner: React.FC = () => {
  const { getOverallReadiness, getCurrentStreak, getContinueRecommendation } = useAppStore();
  const overall = getOverallReadiness();
  const streak = getCurrentStreak();
  const rec = getContinueRecommendation();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy-900 border border-navy-800 p-6 sm:p-8 md:p-10 text-cream-100 shadow-soft-lg transition-all">
      {/* Soft blurred coral / navy gradient glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-coral-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-navy-700/60 blur-2xl" />

      <div className="relative z-10 max-w-3xl">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-3.5 py-1 text-xs font-semibold text-coral-400 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Single-User Placement & Internship Accelerator</span>
        </div>

        {/* Hero headline in Fraunces serif */}
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-cream-100 leading-[1.15]">
          Placements that feel like a month, not a year.
        </h1>

        <p className="mt-3 text-sm sm:text-base text-cream-300/80 leading-relaxed max-w-2xl">
          Systematic, distraction-free tracker across DSA mastery, real-world development roadmaps,
          agentic AI frameworks, and core engineering fundamentals.
        </p>

        {/* Quick action buttons & status row */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to={rec.route}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-coral-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-coral-600 hover:shadow-glow-coral active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
          >
            <span>Continue Prep</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/dsa"
            className="inline-flex items-center gap-2 rounded-2xl border border-cream-200/20 bg-cream-100/10 px-4 py-3 text-sm font-medium text-cream-200 backdrop-blur-sm transition-all hover:bg-cream-100/20 hover:text-white"
          >
            <span>Solve DSA Problems</span>
          </Link>

          {/* Quick inline status */}
          <div className="hidden lg:flex items-center gap-4 border-l border-cream-200/20 pl-4 text-xs text-cream-300/70">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-coral-400" />
              <span>
                <strong className="text-cream-100">{streak}</strong> day streak
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-coral-400" />
              <span>
                <strong className="text-cream-100">{overall}%</strong> ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
