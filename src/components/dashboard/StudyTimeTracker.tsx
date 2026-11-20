import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Timer,
  Check,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTimerStore } from '../../store/useTimerStore';
import { StudyCategory, StudySession } from '../../types';

const CATEGORIES: StudyCategory[] = [
  'DSA',
  'Development',
  'AI & Tools',
  'CS Fundamentals',
  'Projects',
  'General',
];

const PRESETS = [
  { label: '25m Focus', minutes: 25 },
  { label: '50m Deep', minutes: 50 },
  { label: '5m Break', minutes: 5 },
  { label: 'Stopwatch', minutes: 0 },
];

function formatMinutes(mins: number): string {
  if (mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function formatTimerDisplay(secs: number): string {
  const hrs = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

export const StudyTimeTracker: React.FC = () => {
  const {
    addStudySession,
    deleteStudySession,
    getTodayStudyMinutes,
    getWeekStudyMinutes,
    getTotalStudyMinutes,
    getStudyCategoryBreakdown,
    getRecentStudySessions,
  } = useAppStore();

  const {
    isRunning,
    mode: timerMode,
    category: timerCategory,
    secondsLeft,
    initialSeconds,
    isFinished,
    soundEnabled,
    setPreset: handleSelectPreset,
    setCategory: setTimerCategory,
    toggleTimer: handleToggleTimer,
    resetTimer: handleResetTimer,
    toggleSound,
    saveSession,
    isPipActive,
    openPip,
    closePip,
  } = useTimerStore();

  const todayMins = getTodayStudyMinutes();
  const weekMins = getWeekStudyMinutes();
  const totalMins = getTotalStudyMinutes();
  const breakdown = getStudyCategoryBreakdown();
  const recentSessions = getRecentStudySessions(6);

  // Manual Log Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logHours, setLogHours] = useState('0');
  const [logMinutes, setLogMinutes] = useState('45');
  const [logCategory, setLogCategory] = useState<StudyCategory>('DSA');
  const [logNote, setLogNote] = useState('');
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Save session from Timer
  const handleSaveTimerSession = async () => {
    const mins = await saveSession();
    setLogSuccessMessage(`Logged ${formatMinutes(mins)} of ${timerCategory}!`);
    setTimeout(() => setLogSuccessMessage(''), 3000);
  };

  // Submit Manual Log
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(logHours, 10) || 0;
    const m = parseInt(logMinutes, 10) || 0;
    const total = h * 60 + m;

    if (total <= 0) return;

    await addStudySession({
      date: logDate,
      minutes: total,
      category: logCategory,
      note: logNote.trim() || undefined,
    });

    setIsLogModalOpen(false);
    setLogHours('0');
    setLogMinutes('45');
    setLogNote('');
    setLogSuccessMessage(`Added ${formatMinutes(total)} to ${logCategory} for ${logDate}!`);
    setTimeout(() => setLogSuccessMessage(''), 3500);
  };

  // Progress percentage for timer circle/bar
  const timerProgress =
    timerMode === 0
      ? 100
      : Math.min(100, Math.max(0, ((initialSeconds - secondsLeft) / initialSeconds) * 100));

  const hasElapsed =
    timerMode === 0 ? secondsLeft > 0 : secondsLeft < initialSeconds;

  return (
    <div className="space-y-6">
      {/* Header bar with summary & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
              Study Time & Focus Center
            </h2>
            <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-[10px] font-bold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300 uppercase tracking-wider">
              Live Tracker
            </span>
          </div>
          <p className="text-xs text-navy-600/80 dark:text-cream-300/60">
            Log your placement preparation hours and run deep work Pomodoro sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Metrics Badge */}
          <div className="hidden md:flex items-center gap-4 rounded-2xl border border-cream-300/80 bg-cream-50 px-4 py-2 text-xs font-semibold dark:border-navy-800 dark:bg-navy-900 shadow-soft">
            <div>
              <span className="text-navy-500 dark:text-cream-400 block text-[10px] uppercase font-bold tracking-wider">
                Today
              </span>
              <span className="text-coral-500 font-bold">{formatMinutes(todayMins)}</span>
            </div>
            <div className="h-6 w-px bg-cream-300 dark:bg-navy-700" />
            <div>
              <span className="text-navy-500 dark:text-cream-400 block text-[10px] uppercase font-bold tracking-wider">
                This Week
              </span>
              <span className="text-navy-900 dark:text-cream-100 font-bold">{formatMinutes(weekMins)}</span>
            </div>
            <div className="h-6 w-px bg-cream-300 dark:bg-navy-700" />
            <div>
              <span className="text-navy-500 dark:text-cream-400 block text-[10px] uppercase font-bold tracking-wider">
                All-Time
              </span>
              <span className="text-navy-900 dark:text-cream-100 font-bold">{formatMinutes(totalMins)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-coral-500 px-4 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral"
          >
            <Plus className="h-4 w-4" />
            <span>Log Study Time</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {logSuccessMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-coral-200 bg-coral-50 p-3 text-xs font-semibold text-coral-800 dark:border-coral-900 dark:bg-coral-950/40 dark:text-coral-200 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-coral-500" />
          <span>{logSuccessMessage}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Category Breakdown & Recent Entries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Category Breakdown */}
          <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-coral-500" />
                <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                  Study Hours Breakdown
                </h3>
              </div>
              <span className="text-xs font-bold text-navy-600/80 dark:text-cream-300/70">
                Total: <strong className="text-coral-500">{formatMinutes(totalMins)}</strong>
              </span>
            </div>

            {/* Category Bars */}
            <div className="space-y-3">
              {breakdown.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy-800 dark:text-cream-200">
                      {item.category}
                    </span>
                    <span className="text-navy-600/70 dark:text-cream-300/60 font-mono text-[11px]">
                      {formatMinutes(item.minutes)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800">
                    <div
                      className="h-full rounded-full bg-coral-500 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {totalMins === 0 && (
              <p className="mt-4 text-center text-xs text-navy-500 dark:text-cream-400 py-2">
                No study time logged yet. Use the timer or click "Log Study Time" to record your prep hours!
              </p>
            )}
          </div>

          {/* Card: Recent Study Entries Log */}
          <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
            <h4 className="font-serif text-base font-bold text-navy-900 dark:text-cream-100 mb-3">
              Recent Study Sessions
            </h4>

            {recentSessions.length === 0 ? (
              <p className="text-xs text-navy-500 dark:text-cream-400 py-4 text-center">
                No study sessions recorded yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentSessions.map((session: StudySession) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-cream-300/60 bg-cream-100/60 p-3 text-xs transition dark:border-navy-800 dark:bg-navy-850/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 rounded-lg bg-coral-100 px-2 py-1 font-bold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300 font-mono text-[11px]">
                        {session.date}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy-900 dark:text-cream-100">
                            {session.category}
                          </span>
                          <span className="text-navy-500 dark:text-cream-400 text-[11px]">
                            • {formatMinutes(session.minutes)}
                          </span>
                        </div>
                        {session.note && (
                          <p className="text-[11px] text-navy-600/70 dark:text-cream-300/60 truncate mt-0.5">
                            {session.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteStudySession(session.id)}
                      className="shrink-0 rounded-xl p-1.5 text-navy-400 hover:bg-red-50 hover:text-red-600 dark:text-cream-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition"
                      title="Delete study entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Pomodoro & Deep Focus Timer */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 flex flex-col justify-between h-full">
            <div>
              {/* Card Header with Pop-out & Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-coral-500" />
                  <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                    Focus Timer & Pomodoro
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Single Always on Top Button */}
                  <button
                    onClick={isPipActive ? closePip : () => openPip()}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      isPipActive
                        ? 'border-coral-400 bg-coral-500 text-white shadow-sm'
                        : 'border-cream-300 bg-cream-100 text-navy-800 hover:border-coral-400 hover:text-coral-600 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200'
                    }`}
                    title={isPipActive ? 'Dock timer back to dashboard' : 'Float timer Always on Top (stays visible even when Chrome is minimized)'}
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-coral-500" />
                    <span>{isPipActive ? 'Dock Timer' : 'Always on Top'}</span>
                  </button>

                  <button
                    onClick={toggleSound}
                    className="rounded-xl p-1.5 text-navy-500 hover:bg-cream-200 dark:text-cream-400 dark:hover:bg-navy-800 transition"
                    title={soundEnabled ? 'Mute chime' : 'Enable completion chime'}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Mode Selector Chips */}
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-cream-200/60 dark:bg-navy-850 mb-5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSelectPreset(p.minutes)}
                    className={`rounded-xl py-1.5 text-[11px] font-bold transition text-center ${
                      timerMode === p.minutes
                        ? 'bg-white text-navy-900 shadow-xs dark:bg-navy-700 dark:text-cream-100'
                        : 'text-navy-600 hover:text-navy-900 dark:text-cream-400 dark:hover:text-cream-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Category Selector for Timer */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-500 dark:text-cream-400 mb-1.5">
                  Currently Studying:
                </label>
                <select
                  value={timerCategory}
                  onChange={(e) => setTimerCategory(e.target.value as StudyCategory)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs font-bold text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Big Digital Timer Display */}
              <div className="relative flex flex-col items-center justify-center py-6 rounded-3xl bg-cream-100/60 dark:bg-navy-950/50 border border-cream-300/40 dark:border-navy-800/60">
                <div
                  className={`font-serif text-5xl sm:text-6xl font-bold tracking-tight transition-colors ${
                    isFinished
                      ? 'text-coral-500 animate-pulse'
                      : isRunning
                      ? 'text-navy-900 dark:text-cream-100'
                      : 'text-navy-800/80 dark:text-cream-200/80'
                  }`}
                >
                  {formatTimerDisplay(secondsLeft)}
                </div>

                <div className="mt-2 text-xs font-semibold text-navy-600/70 dark:text-cream-300/60">
                  {isFinished ? (
                    <span className="text-coral-500 font-bold">Session Complete! 🎉</span>
                  ) : timerMode === 0 ? (
                    'Stopwatch Elapsed'
                  ) : isRunning ? (
                    'Deep Focus in Progress...'
                  ) : (
                    'Ready to Start'
                  )}
                </div>

                {/* Linear progress fill bar */}
                {timerMode > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden rounded-b-3xl bg-cream-300/40 dark:bg-navy-800">
                    <div
                      className="h-full bg-coral-500 transition-all duration-500"
                      style={{ width: `${timerProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Timer Action Buttons */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleTimer}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold text-white shadow-soft transition ${
                    isRunning
                      ? 'bg-navy-800 hover:bg-navy-900 dark:bg-navy-700 dark:hover:bg-navy-600'
                      : 'bg-coral-500 hover:bg-coral-600 hover:shadow-glow-coral'
                  }`}
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                  <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={handleResetTimer}
                  className="rounded-2xl border border-cream-300 bg-cream-100 p-3 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-300 dark:hover:bg-navy-700 transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Log Completed / Elapsed Button */}
              {hasElapsed && (
                <button
                  onClick={handleSaveTimerSession}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-coral-300 bg-coral-50 py-2.5 px-4 text-xs font-bold text-coral-700 hover:bg-coral-100 dark:border-coral-900/60 dark:bg-coral-950/40 dark:text-coral-300 dark:hover:bg-coral-900/50 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    Save Elapsed Time to {timerCategory} Log
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Time Entry Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-cream-300 bg-cream-50 p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-coral-500" />
                <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                  Log Placement Study Time
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-xl p-1 text-navy-400 hover:bg-cream-200 dark:text-cream-400 dark:hover:bg-navy-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                  Study Date
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-100 p-2.5 text-xs font-semibold text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                  Time Spent
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={logHours}
                        onChange={(e) => setLogHours(e.target.value)}
                        className="w-full rounded-2xl border border-cream-300 bg-cream-100 p-2.5 pr-8 text-xs font-bold text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-semibold text-navy-500 dark:text-cream-400">
                        hrs
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={logMinutes}
                        onChange={(e) => setLogMinutes(e.target.value)}
                        className="w-full rounded-2xl border border-cream-300 bg-cream-100 p-2.5 pr-8 text-xs font-bold text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-semibold text-navy-500 dark:text-cream-400">
                        mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {[
                    { label: '30m', h: '0', m: '30' },
                    { label: '45m', h: '0', m: '45' },
                    { label: '1h', h: '1', m: '0' },
                    { label: '1.5h', h: '1', m: '30' },
                    { label: '2h', h: '2', m: '0' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        setLogHours(chip.h);
                        setLogMinutes(chip.m);
                      }}
                      className="rounded-xl border border-cream-300 bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-navy-700 hover:bg-coral-50 hover:border-coral-300 hover:text-coral-600 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-300 dark:hover:bg-coral-950/40 dark:hover:text-coral-300 transition"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                  Category Studied
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setLogCategory(cat)}
                      className={`rounded-2xl border p-2.5 text-xs font-bold transition text-left ${
                        logCategory === cat
                          ? 'border-coral-500 bg-coral-50 text-coral-700 dark:border-coral-500 dark:bg-coral-950/40 dark:text-coral-300 shadow-xs'
                          : 'border-cream-300 bg-cream-100 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="e.g. Dynamic Programming 2D Grid, Prisma relations..."
                  className="w-full rounded-2xl border border-cream-300 bg-cream-100 p-2.5 text-xs text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="rounded-2xl border border-cream-300 bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-cream-100 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-coral-500 px-5 py-2 text-xs font-bold text-white shadow-soft hover:bg-coral-600 transition"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Study Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
