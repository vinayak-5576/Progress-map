import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Volume2,
  VolumeX,
  ChevronDown,
  Minimize2,
} from 'lucide-react';
import { useTimerStore, getPipWindow } from '../../store/useTimerStore';
import { useAppStore } from '../../store/useAppStore';
import { StudyCategory } from '../../types';

const CATEGORIES: StudyCategory[] = [
  'DSA',
  'Development',
  'AI & Tools',
  'CS Fundamentals',
  'Projects',
  'General',
];

const PRESETS = [
  { label: '25m', minutes: 25 },
  { label: '50m', minutes: 50 },
  { label: '5m', minutes: 5 },
  { label: 'Stop', minutes: 0 },
];

function formatDisplay(secs: number): string {
  const hrs = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

export const PictureInPictureManager: React.FC = () => {
  const {
    isRunning,
    mode,
    category,
    secondsLeft,
    initialSeconds,
    isFinished,
    isPipActive,
    soundEnabled,
    toggleTimer,
    resetTimer,
    setPreset,
    setCategory,
    toggleSound,
    saveSession,
    closePip,
  } = useTimerStore();

  const theme = useAppStore((s) => s.data?.theme);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const pipWin = getPipWindow();

  // Sync theme changes to PiP window
  useEffect(() => {
    if (pipWin && !pipWin.closed) {
      const isDark = theme === 'dark';
      pipWin.document.documentElement.className = isDark ? 'dark' : '';
      pipWin.document.body.className = isDark
        ? 'bg-navy-950 text-cream-100 m-0 p-3 h-full flex flex-col justify-between overflow-hidden select-none font-sans'
        : 'bg-cream-100 text-navy-900 m-0 p-3 h-full flex flex-col justify-between overflow-hidden select-none font-sans';
    }
  }, [theme, pipWin]);

  if (!isPipActive || !pipWin || pipWin.closed) {
    return null;
  }

  const hasElapsed = mode === 0 ? secondsLeft > 0 : secondsLeft < initialSeconds;
  const progressPct =
    mode === 0
      ? 100
      : Math.min(
          100,
          Math.max(0, ((initialSeconds - secondsLeft) / initialSeconds) * 100)
        );

  const handleSave = async () => {
    await saveSession();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return createPortal(
    <div className="flex flex-col justify-between h-full w-full select-none">
      {/* Top Bar: Category dropdown + Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-cream-300/80 dark:border-navy-800">
        {/* Category Badge */}
        <div className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-coral-200 bg-coral-50/90 px-2.5 py-1 text-[11px] font-bold text-coral-700 hover:bg-coral-100 dark:border-coral-900/60 dark:bg-coral-950/60 dark:text-coral-300 transition"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isRunning ? 'bg-coral-500 animate-pulse' : 'bg-navy-400 dark:bg-cream-400'
              }`}
            />
            <span>{category}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {isCategoryOpen && (
            <div className="absolute left-0 top-full mt-1 w-36 rounded-2xl border border-cream-300 bg-white p-1 shadow-2xl dark:border-navy-700 dark:bg-navy-850 z-50">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full rounded-xl px-2.5 py-1 text-left text-xs font-semibold transition ${
                    category === cat
                      ? 'bg-coral-500 text-white'
                      : 'text-navy-700 hover:bg-cream-100 dark:text-cream-200 dark:hover:bg-navy-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top Right: Sound & Return to Tab */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSound}
            className="rounded-lg p-1 text-navy-500 hover:bg-cream-200 dark:text-cream-400 dark:hover:bg-navy-800 transition"
            title={soundEnabled ? 'Mute chime' : 'Enable chime'}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={closePip}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-navy-600 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-navy-800 transition"
            title="Dock back to main tab"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Dock</span>
          </button>
        </div>
      </div>

      {/* Center: Clock + Progress */}
      <div className="flex flex-col items-center justify-center py-1">
        <div
          className={`font-serif text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isFinished
              ? 'text-coral-500 animate-pulse'
              : isRunning
              ? 'text-navy-900 dark:text-cream-100'
              : 'text-navy-700 dark:text-cream-300'
          }`}
        >
          {formatDisplay(secondsLeft)}
        </div>

        <div className="text-[11px] font-semibold text-navy-500 dark:text-cream-400">
          {savedMsg ? (
            <span className="text-coral-600 dark:text-coral-300">✓ Logged to {category}!</span>
          ) : isFinished ? (
            'Session Finished! 🎉'
          ) : isRunning ? (
            'Focusing in progress...'
          ) : mode === 0 ? (
            'Stopwatch'
          ) : (
            `${mode}m Pomodoro`
          )}
        </div>

        {mode > 0 && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800 mt-2">
            <div
              className="h-full rounded-full bg-coral-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Preset Chips */}
      <div className="grid grid-cols-4 gap-1 p-0.5 rounded-xl bg-cream-200/60 dark:bg-navy-850">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setPreset(p.minutes)}
            className={`rounded-lg py-1 text-[10px] font-bold text-center transition ${
              mode === p.minutes
                ? 'bg-white text-navy-900 shadow-xs dark:bg-navy-700 dark:text-cream-100'
                : 'text-navy-600 hover:text-navy-900 dark:text-cream-400 dark:hover:text-cream-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          onClick={toggleTimer}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-1.5 px-3 text-xs font-bold text-white shadow-soft transition ${
            isRunning
              ? 'bg-navy-800 hover:bg-navy-900 dark:bg-navy-700 dark:hover:bg-navy-600'
              : 'bg-coral-500 hover:bg-coral-600'
          }`}
        >
          {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="rounded-xl border border-cream-300 bg-cream-100 p-1.5 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-300 transition"
          title="Reset timer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {hasElapsed && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-xl border border-coral-300 bg-coral-50 px-2 py-1.5 text-xs font-bold text-coral-700 hover:bg-coral-100 dark:border-coral-800 dark:bg-coral-950/60 dark:text-coral-300 transition"
            title="Save elapsed study time"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save</span>
          </button>
        )}
      </div>
    </div>,
    pipWin.document.body
  );
};
