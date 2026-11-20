import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, Binary, Code2, Sparkles, ListOrdered } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

function getPillarIcon(id: string) {
  switch (id) {
    case 'dsa':
      return <Binary className="h-4 w-4" />;
    case 'development':
      return <Code2 className="h-4 w-4" />;
    case 'ai-tools':
      return <Sparkles className="h-4 w-4" />;
    default:
      return <PlayCircle className="h-4 w-4" />;
  }
}

export const ContinueCard: React.FC = () => {
  const { getActiveTracksRecommendations } = useAppStore();
  const { allCoreTracks } = getActiveTracksRecommendations();

  const activeCount = allCoreTracks.filter((t) => t.isStarted).length;

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-cream-300/80 bg-cream-50 p-5 sm:p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors h-full">
      {/* 1. Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cream-200/80 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral-100 text-coral-600 dark:bg-coral-950/60 dark:text-coral-400">
              <PlayCircle className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 dark:text-cream-200">
                Continue Where You Left Off • Core Prep Pillars
              </h3>
              <p className="text-[11px] text-navy-500 dark:text-cream-400">
                Next steps across DSA, Development, and AI & AI Tools
              </p>
            </div>
          </div>

          <span className="rounded-full bg-coral-50 border border-coral-200 px-2.5 py-0.5 text-[11px] font-bold text-coral-700 dark:border-coral-900/60 dark:bg-coral-950/60 dark:text-coral-300">
            {activeCount} of 3 Pillars Active
          </span>
        </div>

        {/* 2. Three Pillars Grid: DSA | Development | AI Tools */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {allCoreTracks.map((track) => (
            <div
              key={track.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                track.isStarted
                  ? 'border-cream-300 bg-cream-100/80 hover:border-coral-300 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-coral-500/60 shadow-xs'
                  : 'border-dashed border-cream-300/90 bg-cream-100/40 hover:border-coral-300/70 dark:border-navy-800 dark:bg-navy-900/40'
              }`}
            >
              <div>
                {/* Pillar Tag & Status */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 rounded-lg bg-cream-200/80 px-2 py-0.5 text-[11px] font-bold text-navy-800 dark:bg-navy-750 dark:text-cream-200">
                    <span className="text-coral-500">{getPillarIcon(track.id)}</span>
                    <span>{track.tag}</span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      track.type === 'in_progress'
                        ? 'bg-coral-100 text-coral-700 dark:bg-coral-950/60 dark:text-coral-300'
                        : track.type === 'next_up'
                        ? 'bg-cream-200 text-navy-700 dark:bg-navy-700 dark:text-cream-300'
                        : 'bg-cream-200/70 text-navy-500 dark:bg-navy-800 dark:text-cream-400'
                    }`}
                  >
                    {track.type === 'in_progress'
                      ? 'In Progress'
                      : track.type === 'next_up'
                      ? 'Next in Queue'
                      : 'Start Track'}
                  </span>
                </div>

                {/* Topic / Problem Title & Breadcrumb (clean 2-line wrap without cut-off) */}
                <div className="mt-3">
                  <h4
                    className="font-serif text-base font-bold tracking-tight text-navy-900 dark:text-cream-100 line-clamp-2 min-h-[3rem]"
                    title={track.title}
                  >
                    {track.title}
                  </h4>
                  <p
                    className="mt-1 text-xs text-navy-600/80 dark:text-cream-300/60 line-clamp-1"
                    title={track.subtitle}
                  >
                    {track.subtitle}
                  </p>
                </div>
              </div>

              {/* Progress Stats & Action Button */}
              <div className="mt-4 pt-3 border-t border-cream-200/70 dark:border-navy-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-navy-500 dark:text-cream-400 truncate">
                  {track.stats}
                </span>

                <Link
                  to={track.route}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-soft transition shrink-0 ${
                    track.isStarted
                      ? 'bg-coral-500 text-white hover:bg-coral-600 hover:shadow-glow-coral'
                      : 'border border-cream-300 bg-cream-50 text-navy-800 hover:border-coral-400 hover:text-coral-600 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200'
                  }`}
                >
                  <span>{track.actionLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Queue: Fills the lower section purposefully */}
      <div className="mt-4 pt-3.5 border-t border-cream-200/80 dark:border-navy-800">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-navy-800 dark:text-cream-200">
          <ListOrdered className="h-3.5 w-3.5 text-coral-500" />
          <span>Upcoming in Queue (Next in line across pillars):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allCoreTracks.map((track) => (
            <div
              key={`queue-${track.id}`}
              className="rounded-2xl border border-cream-200/80 bg-cream-100/60 p-3 dark:border-navy-800 dark:bg-navy-950/40"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-coral-600 dark:text-coral-400 mb-1.5">
                <span>{track.tag} Queue</span>
                <span className="text-navy-400 dark:text-cream-400/50 lowercase font-normal">next 2</span>
              </div>

              {track.upcoming && track.upcoming.length > 0 ? (
                <ul className="space-y-1.5">
                  {track.upcoming.map((u, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-navy-700 dark:text-cream-300">
                      <span className="text-[10px] font-bold text-coral-500 font-mono mt-0.5 shrink-0">
                        #{i + 2}
                      </span>
                      <span className="line-clamp-1 font-medium text-navy-800 dark:text-cream-200" title={u.title}>
                        {u.title}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-navy-500 dark:text-cream-400">Queue complete 🎉</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
