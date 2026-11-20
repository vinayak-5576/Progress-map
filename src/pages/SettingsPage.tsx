import React, { useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const SettingsPage: React.FC = () => {
  const { data, toggleTheme, exportData, importData, resetAll } = useAppStore();
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const isDark = data?.theme === 'dark';

  const handleExport = async () => {
    try {
      const json = await exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `placement-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Backup downloaded successfully!' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to export backup.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await importData(content);
        if (success) {
          setStatusMessage({ type: 'success', text: 'Progress data imported successfully!' });
        } else {
          setStatusMessage({ type: 'error', text: 'Invalid JSON format or corrupted file.' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = async () => {
    if (!importJson.trim()) return;
    const success = await importData(importJson);
    if (success) {
      setImportJson('');
      setStatusMessage({ type: 'success', text: 'Progress restored successfully from JSON!' });
    } else {
      setStatusMessage({ type: 'error', text: 'Invalid JSON syntax. Please check and retry.' });
    }
  };

  const handleReset = async () => {
    await resetAll();
    setIsResetConfirmOpen(false);
    setStatusMessage({ type: 'success', text: 'All progress reset to clean state.' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
          Settings & Local Data Management
        </h1>
        <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
          Export your progress, restore from backups, or configure your workspace appearance.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'border border-coral-200 bg-coral-50 text-coral-800 dark:border-coral-900 dark:bg-coral-950/40 dark:text-coral-200'
              : 'border border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-coral-500 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Appearance Section */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
        <h2 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100">
          Appearance & Theme
        </h2>
        <p className="mt-1 text-xs text-navy-600/70 dark:text-cream-300/50">
          Navy / Cream / Coral editorial design system
        </p>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-cream-200 dark:border-navy-800">
          <div>
            <div className="text-sm font-semibold text-navy-900 dark:text-cream-100">
              Color Palette Theme
            </div>
            <div className="text-xs text-navy-600/70 dark:text-cream-300/60">
              Currently using {isDark ? 'Dark Navy' : 'Warm Cream'} mode
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-2xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-xs font-semibold text-navy-800 transition hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200 dark:hover:bg-navy-700"
          >
            {isDark ? <Sun className="h-4 w-4 text-coral-400" /> : <Moon className="h-4 w-4 text-navy-700" />}
            <span>Switch to {isDark ? 'Light (Cream)' : 'Dark (Navy)'}</span>
          </button>
        </div>
      </div>

      {/* Export & Backup Section */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
        <div className="flex items-center gap-2.5">
          <Database className="h-5 w-5 text-coral-500" />
          <h2 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100">
            Export & Backup Progress
          </h2>
        </div>
        <p className="mt-1 text-xs text-navy-600/70 dark:text-cream-300/50">
          All progress data is abstracted via the Repository Pattern (<code className="font-mono text-coral-500">ProgressRepo</code>),
          making it effortless to save locally or migrate to Firebase in the future.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-2xl bg-coral-500 px-5 py-3 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral"
          >
            <Download className="h-4 w-4" />
            <span>Download Full Progress Backup (.json)</span>
          </button>

          <label className="inline-flex items-center gap-2 rounded-2xl border border-cream-300 bg-cream-100 px-5 py-3 text-xs font-semibold text-navy-800 cursor-pointer transition hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200 dark:hover:bg-navy-700">
            <Upload className="h-4 w-4" />
            <span>Upload Backup File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Paste JSON directly */}
        <div className="mt-6 pt-6 border-t border-cream-200 dark:border-navy-800">
          <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200">
            Or Paste JSON Backup String:
          </label>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            rows={4}
            placeholder='{"dsaItems": {...}, "milestones": {...}}'
            className="mt-2 w-full rounded-2xl border border-cream-300 bg-cream-100 p-3 font-mono text-xs text-navy-900 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
          />
          <button
            onClick={handleTextImport}
            disabled={!importJson.trim()}
            className="mt-2.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-cream-100 transition hover:bg-navy-800 disabled:opacity-50 dark:bg-coral-500 dark:text-navy-950 dark:hover:bg-coral-600"
          >
            Import Pasted JSON
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-soft dark:border-red-950/60 dark:bg-red-950/10">
        <h2 className="font-serif text-xl font-bold text-red-900 dark:text-red-300">
          Danger Zone
        </h2>
        <p className="mt-1 text-xs text-red-700/80 dark:text-red-400/70">
          Reset all progress back to clean initial state. This action cannot be undone unless you have an exported backup.
        </p>

        <div className="mt-4">
          {!isResetConfirmOpen ? (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-navy-900 dark:text-red-300 dark:hover:bg-navy-800"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Progress Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-xl border border-cream-300 bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-cream-100 dark:border-navy-700 dark:bg-navy-900 dark:text-cream-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
