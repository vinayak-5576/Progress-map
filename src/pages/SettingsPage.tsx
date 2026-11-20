import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cloud,
  Smartphone,
  Laptop,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { progressRepo } from '../lib/storage';
import {
  getActiveFirebaseConfig,
  saveUserFirebaseConfig,
  FirebaseConfig,
} from '../lib/firebase';

export const SettingsPage: React.FC = () => {
  const { data, toggleTheme, exportData, importData, resetAll } = useAppStore();
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Cloud Sync State
  const [isCloudActive, setIsCloudActive] = useState(progressRepo.isCloudSyncActive());
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [fbApiKey, setFbApiKey] = useState('');
  const [fbProjectId, setFbProjectId] = useState('');
  const [fbAppId, setFbAppId] = useState('');
  const [fbRawConfig, setFbRawConfig] = useState('');

  useEffect(() => {
    setIsCloudActive(progressRepo.isCloudSyncActive());
    const existing = getActiveFirebaseConfig();
    if (existing) {
      setFbApiKey(existing.apiKey || '');
      setFbProjectId(existing.projectId || '');
      setFbAppId(existing.appId || '');
    }
  }, []);

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

  const handleSaveFirebaseConfig = () => {
    let config: FirebaseConfig | null = null;

    if (fbRawConfig.trim()) {
      try {
        const clean = fbRawConfig.replace(/(const|let|var)\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
        const parsed = Function(`"use strict"; return (${clean})`)();
        if (parsed.apiKey && parsed.projectId) {
          config = {
            apiKey: parsed.apiKey,
            authDomain: parsed.authDomain || `${parsed.projectId}.firebaseapp.com`,
            projectId: parsed.projectId,
            storageBucket: parsed.storageBucket || `${parsed.projectId}.appspot.com`,
            messagingSenderId: parsed.messagingSenderId || '',
            appId: parsed.appId || '',
          };
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Could not parse pasted Firebase config. Please verify syntax.' });
        return;
      }
    } else if (fbApiKey.trim() && fbProjectId.trim()) {
      config = {
        apiKey: fbApiKey.trim(),
        authDomain: `${fbProjectId.trim()}.firebaseapp.com`,
        projectId: fbProjectId.trim(),
        storageBucket: `${fbProjectId.trim()}.appspot.com`,
        messagingSenderId: '',
        appId: fbAppId.trim(),
      };
    }

    if (config) {
      saveUserFirebaseConfig(config);
      progressRepo.reconnectCloud();
      setIsCloudActive(true);
      setStatusMessage({ type: 'success', text: 'Firebase credentials saved! Attempting cloud sync...' });
    } else {
      setStatusMessage({ type: 'error', text: 'Please provide at least API Key and Project ID.' });
    }
  };

  const handleDisconnectCloud = () => {
    saveUserFirebaseConfig(null);
    setIsCloudActive(false);
    setStatusMessage({ type: 'success', text: 'Cloud sync disconnected. App is now in local mode.' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
          Settings & Data Sync
        </h1>
        <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
          Synchronize progress between your phone and laptop, export backups, or manage appearance.
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

      {/* Cross-Device Cloud Sync Section */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500/10 text-coral-500 dark:bg-coral-500/20">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100">
                Cross-Device Cloud Sync
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    isCloudActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-navy-400 dark:bg-cream-400'
                  }`}
                />
                <span className="text-xs font-medium text-navy-700 dark:text-cream-300">
                  {isCloudActive
                    ? 'Connected: Real-time Cloud Sync Active'
                    : 'Local Mode: Stored in this device browser only'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-cream-300 bg-cream-100 px-4 py-2.5 text-xs font-semibold text-navy-800 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200"
            >
              <span>{isCloudActive ? 'Manage Firebase' : 'Connect Firebase'}</span>
              {isConfigExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Sync explanation cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-cream-200 dark:border-navy-800">
          <div className="flex items-start gap-3 rounded-2xl border border-cream-300/60 bg-cream-100/60 p-4 dark:border-navy-800 dark:bg-navy-850/60">
            <Laptop className="h-5 w-5 text-coral-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-navy-900 dark:text-cream-100">
                Method 1: Instant Backup Transfer (No Setup)
              </div>
              <p className="mt-1 text-xs text-navy-600/80 dark:text-cream-300/70">
                Click <strong>"Download Full Progress Backup"</strong> on your laptop below, send the <code className="text-coral-500">.json</code> file to your phone, and tap <strong>Upload Backup File</strong> on your phone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-cream-300/60 bg-cream-100/60 p-4 dark:border-navy-800 dark:bg-navy-850/60">
            <Smartphone className="h-5 w-5 text-coral-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-navy-900 dark:text-cream-100">
                Method 2: Live Firebase Sync (Automatic)
              </div>
              <p className="mt-1 text-xs text-navy-600/80 dark:text-cream-300/70">
                Connect a free Firebase project. Every time you solve a DSA problem or check a concept on phone, your laptop updates in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Firebase Config Accordion */}
        {isConfigExpanded && (
          <div className="mt-5 rounded-2xl border border-cream-300 bg-cream-100 p-5 dark:border-navy-800 dark:bg-navy-850 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900 dark:text-cream-100">
                Connect Google Firebase Firestore
              </h3>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-coral-500 hover:underline"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-1 text-xs text-navy-600/70 dark:text-cream-300/60">
              Create a free project at Firebase Console $\rightarrow$ click Web app $\rightarrow$ enable Firestore Database in test mode.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200">
                  Option A: Paste your entire <code className="text-coral-500 font-mono">firebaseConfig</code> code snippet:
                </label>
                <textarea
                  value={fbRawConfig}
                  onChange={(e) => setFbRawConfig(e.target.value)}
                  rows={3}
                  placeholder={'const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "placement-prep-...",\n  appId: "..."\n};'}
                  className="mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 font-mono text-xs text-navy-900 focus:border-coral-500 focus:outline-none dark:border-navy-700 dark:bg-navy-900 dark:text-cream-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200">
                    Option B: API Key
                  </label>
                  <input
                    type="text"
                    value={fbApiKey}
                    onChange={(e) => setFbApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50 p-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-cream-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200">
                    Project ID
                  </label>
                  <input
                    type="text"
                    value={fbProjectId}
                    onChange={(e) => setFbProjectId(e.target.value)}
                    placeholder="placement-prep-tracker"
                    className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50 p-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-cream-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={handleSaveFirebaseConfig}
                  className="inline-flex items-center gap-2 rounded-xl bg-coral-500 px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-coral-600"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Save & Connect Cloud Sync</span>
                </button>

                {isCloudActive && (
                  <button
                    onClick={handleDisconnectCloud}
                    className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-xs font-medium text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-900 dark:text-cream-300"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              <div className="mt-3 rounded-xl bg-cream-200/50 p-3 text-[11px] text-navy-600 dark:bg-navy-900/60 dark:text-cream-300/70">
                💡 <strong>Pro-Tip for Vercel:</strong> You can also add <code className="text-coral-500 font-mono">VITE_FIREBASE_API_KEY</code> and <code className="text-coral-500 font-mono">VITE_FIREBASE_PROJECT_ID</code> in your Vercel Project Settings $\rightarrow$ Environment Variables. Then all devices automatically connect to the same database with zero configuration!
              </div>
            </div>
          </div>
        )}
      </div>

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
          Download your progress as a JSON file to transfer between devices or keep safe offline backups.
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
