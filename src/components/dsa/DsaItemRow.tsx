import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Youtube,
  FileText,
  StickyNote,
  Code2,
  BookOpen,
  Save,
  Trash2,
} from 'lucide-react';
import { Item, ItemStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface DsaItemRowProps {
  item: Item;
}

export const DsaItemRow: React.FC<DsaItemRowProps> = ({ item }) => {
  const { data, toggleDsaItem, setDsaItemStatus, updateDsaNotes } = useAppStore();

  const userOverride = data?.dsaItems[item.id];
  const currentStatus: ItemStatus = userOverride?.status || item.status || 'pending';
  const savedNotes = userOverride?.notes || item.notes || '';

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(savedNotes);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleStatusToggle = () => {
    toggleDsaItem(item.id, currentStatus);
  };

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDsaItemStatus(item.id, e.target.value as ItemStatus);
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    await updateDsaNotes(item.id, noteText);
    setTimeout(() => setIsSavingNote(false), 300);
  };

  const handleClearNote = async () => {
    setNoteText('');
    await updateDsaNotes(item.id, '');
  };

  // Determine platform for styling practice button
  const getPlatformInfo = (url?: string, title?: string) => {
    const combined = `${url || ''} ${title || ''}`.toLowerCase();
    if (combined.includes('leetcode')) {
      return { name: 'LeetCode', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-amber-300 dark:border-amber-700/50' };
    }
    if (combined.includes('geeksforgeeks') || combined.includes('gfg')) {
      return { name: 'GFG', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-300 dark:border-emerald-700/50' };
    }
    if (combined.includes('naukri') || combined.includes('code360') || combined.includes('codingninjas')) {
      return { name: 'Code360', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20 border-orange-300 dark:border-orange-700/50' };
    }
    return { name: 'Practice', color: 'bg-navy-800/10 text-navy-800 dark:text-cream-200 hover:bg-navy-800/20 border-navy-300 dark:border-navy-700' };
  };

  const platform = getPlatformInfo(item.links.practice, item.links.practiceTitle);

  return (
    <div
      className={`group rounded-2xl border transition-all duration-150 p-3 sm:p-4 ${
        currentStatus === 'completed'
          ? 'border-cream-300/80 bg-cream-50/60 dark:border-navy-800/80 dark:bg-navy-950/40'
          : currentStatus === 'in_progress'
          ? 'border-coral-200 bg-coral-50/40 dark:border-coral-900/40 dark:bg-coral-950/20'
          : 'border-cream-300/60 bg-cream-50 hover:border-coral-300 dark:border-navy-800 dark:bg-navy-900/90 dark:hover:border-navy-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Checkbox + Status + Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Main completion checkbox button */}
          <button
            type="button"
            onClick={handleStatusToggle}
            className="mt-0.5 shrink-0 transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 rounded-full"
            title={`Status: ${currentStatus}. Click to toggle.`}
            aria-label={`Toggle status for ${item.title}`}
          >
            {currentStatus === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-coral-500 fill-coral-100 dark:fill-coral-950" />
            ) : currentStatus === 'in_progress' ? (
              <Clock className="h-5 w-5 text-coral-400 fill-coral-50 dark:fill-navy-900" />
            ) : (
              <Circle className="h-5 w-5 text-navy-400 hover:text-coral-500 dark:text-cream-400 dark:hover:text-coral-400" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-medium text-sm leading-snug break-words ${
                  currentStatus === 'completed'
                    ? 'line-through text-navy-600/70 dark:text-cream-300/60'
                    : 'text-navy-900 dark:text-cream-100'
                }`}
              >
                {item.title}
              </span>

              {/* Difficulty tag */}
              {item.difficulty && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    item.difficulty === 'Easy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : item.difficulty === 'Hard'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  }`}
                >
                  {item.difficulty}
                </span>
              )}

              {/* Theory badge */}
              {item.links.isTheory && (
                <span className="rounded-md bg-navy-100 px-1.5 py-0.5 text-[10px] font-bold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
                  Theory
                </span>
              )}

              {/* Note indicator badge */}
              {savedNotes && !isNoteOpen && (
                <button
                  onClick={() => setIsNoteOpen(true)}
                  className="inline-flex items-center gap-1 rounded-md bg-cream-200/90 px-1.5 py-0.5 text-[10px] font-medium text-navy-700 hover:bg-cream-300 dark:bg-navy-800 dark:text-cream-300 dark:hover:bg-navy-700"
                  title="Click to view notes"
                >
                  <StickyNote className="h-3 w-3 text-coral-500" />
                  <span className="truncate max-w-[120px]">{savedNotes}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Links + Note toggle + Status Select) */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {/* Practice link button (LeetCode / GFG / Code360) */}
          {item.links.practice ? (
            <a
              href={item.links.practice}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold shadow-xs transition ${platform.color}`}
              title={item.links.practiceTitle || `Solve on ${platform.name}`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>{platform.name}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ) : item.links.isTheory ? (
            <span
              className="inline-flex items-center gap-1 rounded-xl border border-cream-300/80 bg-cream-100 px-2 py-1 text-[11px] font-medium text-navy-600 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300"
              title="Theory topic: watch YouTube video"
            >
              <BookOpen className="h-3 w-3 text-coral-500" />
              <span>Theory</span>
            </span>
          ) : null}

          {/* YouTube Video Link button */}
          {item.links.video ? (
            <a
              href={item.links.video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50 shadow-xs transition"
              title="Watch video explanation"
            >
              <Youtube className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="hidden md:inline">Video</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ) : null}

          {/* Article / Editorial link button */}
          {item.links.article ? (
            <a
              href={item.links.article}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-cream-300 bg-cream-100 px-2.5 py-1 text-xs font-semibold text-navy-800 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-200 dark:hover:bg-navy-700 shadow-xs transition"
              title={item.links.articleTitle || 'Read editorial article'}
            >
              <FileText className="h-3.5 w-3.5 text-coral-500" />
              <span className="hidden md:inline">Article</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ) : null}

          {/* Notes Toggle Button */}
          <button
            type="button"
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold transition ${
              isNoteOpen || savedNotes
                ? 'border-coral-300 bg-coral-50 text-coral-700 dark:border-coral-800 dark:bg-coral-950/50 dark:text-coral-300'
                : 'border-cream-300 bg-cream-100 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-800 dark:text-cream-300 dark:hover:bg-navy-700'
            }`}
            title={savedNotes ? 'Edit note' : 'Add personal note'}
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{savedNotes ? 'Notes' : '+ Note'}</span>
          </button>

          {/* Status select dropdown */}
          <select
            value={currentStatus}
            onChange={handleStatusSelect}
            className={`rounded-xl border px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-coral-500 cursor-pointer ${
              currentStatus === 'completed'
                ? 'border-coral-200 bg-coral-50 text-coral-700 dark:border-coral-800 dark:bg-coral-950/50 dark:text-coral-300'
                : currentStatus === 'in_progress'
                ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                : 'border-cream-300 bg-cream-100 text-navy-700 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Expandable Notes Editor Drawer */}
      {isNoteOpen && (
        <div className="mt-3 pt-3 border-t border-cream-200 dark:border-navy-800 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-navy-800 dark:text-cream-200 flex items-center gap-1.5">
              <StickyNote className="h-3.5 w-3.5 text-coral-500" />
              <span>Personal Notes & Edge Cases for: {item.title}</span>
            </span>
            <div className="flex items-center gap-2">
              {noteText && (
                <button
                  type="button"
                  onClick={handleClearNote}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="inline-flex items-center gap-1 rounded-lg bg-coral-500 px-2.5 py-1 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 disabled:opacity-50"
              >
                <Save className="h-3 w-3" />
                <span>{isSavingNote ? 'Saving...' : 'Save Note'}</span>
              </button>
            </div>
          </div>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="Write key intuition, time/space complexity, common interview traps, or algorithm pseudocode..."
            rows={2}
            className="w-full rounded-xl border border-cream-300 bg-cream-100 p-2.5 text-xs text-navy-900 placeholder:text-navy-400 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 dark:placeholder:text-cream-400"
          />
        </div>
      )}
    </div>
  );
};
