import { create } from 'zustand';
import { StudyCategory } from '../types';
import { useAppStore } from './useAppStore';

interface TimerStoreState {
  isRunning: boolean;
  mode: number; // 25, 50, 5, or 0 (stopwatch)
  category: StudyCategory;
  secondsLeft: number;
  initialSeconds: number;
  isFinished: boolean;
  isPipActive: boolean;
  soundEnabled: boolean;

  // Actions
  setPreset: (minutes: number) => void;
  setCategory: (category: StudyCategory) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  toggleSound: () => void;
  saveSession: () => Promise<number>;
  tick: () => void;
  openPip: () => Promise<boolean>;
  closePip: () => void;
}

let timerInterval: number | null = null;
let lastTickTime: number = Date.now();
let pipWindowInstance: Window | null = null;

export function getPipWindow(): Window | null {
  return pipWindowInstance;
}

function playCompletionChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {
    // Browser autoplay policy
  }
}

export const useTimerStore = create<TimerStoreState>((set, get) => ({
  isRunning: false,
  mode: 25,
  category: 'DSA',
  secondsLeft: 25 * 60,
  initialSeconds: 25 * 60,
  isFinished: false,
  isPipActive: false,
  soundEnabled: true,

  setPreset: (minutes: number) => {
    get().pauseTimer();
    const secs = minutes === 0 ? 0 : minutes * 60;
    set({
      mode: minutes,
      secondsLeft: secs,
      initialSeconds: secs,
      isFinished: false,
    });
  },

  setCategory: (category: StudyCategory) => {
    set({ category });
  },

  tick: () => {
    const { isRunning, mode, secondsLeft, soundEnabled } = get();
    if (!isRunning) return;

    const now = Date.now();
    const elapsedSecs = Math.max(1, Math.round((now - lastTickTime) / 1000));
    lastTickTime = now;

    if (mode === 0) {
      // Stopwatch counts up
      set({ secondsLeft: secondsLeft + elapsedSecs });
    } else {
      // Countdown
      const nextRemaining = secondsLeft - elapsedSecs;
      if (nextRemaining <= 0) {
        set({ secondsLeft: 0, isRunning: false, isFinished: true });
        if (soundEnabled) playCompletionChime();
        get().pauseTimer();
      } else {
        set({ secondsLeft: nextRemaining });
      }
    }
  },

  startTimer: () => {
    if (timerInterval) clearInterval(timerInterval);
    lastTickTime = Date.now();

    const { isFinished, mode } = get();
    if (isFinished && mode > 0) {
      set({ secondsLeft: mode * 60, isFinished: false });
    }

    set({ isRunning: true });

    timerInterval = window.setInterval(() => {
      get().tick();
    }, 1000);
  },

  pauseTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ isRunning: false });
  },

  toggleTimer: () => {
    if (get().isRunning) {
      get().pauseTimer();
    } else {
      get().startTimer();
    }
  },

  resetTimer: () => {
    get().pauseTimer();
    const { mode } = get();
    const secs = mode === 0 ? 0 : mode * 60;
    set({
      secondsLeft: secs,
      initialSeconds: secs,
      isFinished: false,
    });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  saveSession: async (): Promise<number> => {
    const { mode, initialSeconds, secondsLeft, category } = get();
    let completedMinutes = 0;

    if (mode === 0) {
      completedMinutes = Math.max(1, Math.round(secondsLeft / 60));
    } else {
      const elapsedSecs = initialSeconds - secondsLeft;
      completedMinutes = Math.max(1, Math.round(elapsedSecs / 60));
    }

    await useAppStore.getState().addStudySession({
      date: new Date().toISOString().split('T')[0],
      minutes: completedMinutes,
      category,
      note: `Focus session (${mode === 0 ? 'Stopwatch' : `${mode}m Pomodoro`})`,
    });

    get().resetTimer();
    return completedMinutes;
  },

  openPip: async (): Promise<boolean> => {
    if (
      typeof window === 'undefined' ||
      !('documentPictureInPicture' in window) ||
      !window.documentPictureInPicture
    ) {
      alert('Document Picture-in-Picture is supported in Chrome/Edge browsers to keep the timer Always on Top.');
      set({ isPipActive: false });
      return false;
    }

    try {
      if (pipWindowInstance && !pipWindowInstance.closed) {
        pipWindowInstance.focus();
        return true;
      }

      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 340,
        height: 230,
      });

      pipWindowInstance = pipWin;

      // Copy all style and link tags into the PiP window's head
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
        try {
          pipWin.document.head.appendChild(el.cloneNode(true));
        } catch {
          // Cross-origin stylesheet security ignore
        }
      });

      const isDark = document.documentElement.classList.contains('dark');
      pipWin.document.documentElement.className = isDark ? 'dark' : '';
      pipWin.document.title = 'Focus Timer (Always on Top)';
      pipWin.document.body.className = isDark
        ? 'bg-navy-950 text-cream-100 m-0 p-3 h-full flex flex-col justify-between overflow-hidden select-none font-sans'
        : 'bg-cream-100 text-navy-900 m-0 p-3 h-full flex flex-col justify-between overflow-hidden select-none font-sans';

      pipWin.addEventListener('pagehide', () => {
        pipWindowInstance = null;
        set({ isPipActive: false });
      });

      set({ isPipActive: true });
      return true;
    } catch (err) {
      console.warn('Document Picture-in-Picture error or denied:', err);
      set({ isPipActive: false });
      return false;
    }
  },

  closePip: () => {
    if (pipWindowInstance && !pipWindowInstance.closed) {
      pipWindowInstance.close();
      pipWindowInstance = null;
    }
    set({ isPipActive: false });
  },
}));
