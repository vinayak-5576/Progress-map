import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Circle, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const CsFundamentalsPage: React.FC = () => {
  const { data, toggleCsTopic } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'OS', 'DBMS', 'CN', 'OOP', 'System Design'];

  const topics = data?.csFundTopics || [];
  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const total = topics.length;
  const completed = topics.filter((t) => t.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Core Engineering Fundamentals</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
          CS Fundamentals Checklist
        </h1>
        <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
          Essential Operating Systems, Database Management, Networks, OOP, and High-Level System Design.
        </p>
      </div>

      {/* Progress banner */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
              Checklist Completion
            </h3>
            <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
              {completed} of {total} topics revised
            </p>
          </div>
          <span className="font-serif text-2xl font-bold text-coral-500">{pct}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-navy-800">
          <div className="h-full rounded-full bg-coral-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-cream-100 dark:bg-coral-500 dark:text-navy-950 shadow-sm'
                  : 'bg-cream-200/80 text-navy-700 hover:bg-cream-300/80 dark:bg-navy-800 dark:text-cream-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-navy-400 dark:text-cream-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-9 pr-3 py-1.5 text-xs text-navy-900 placeholder:text-navy-400 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 dark:border-navy-700 dark:bg-navy-900 dark:text-cream-100"
          />
        </div>
      </div>

      {/* Topic List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => toggleCsTopic(topic.id)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all duration-150 flex items-start justify-between gap-4 ${
              topic.completed
                ? 'border-coral-200 bg-coral-50/50 dark:border-coral-900/40 dark:bg-coral-950/20'
                : 'border-cream-300/80 bg-cream-50 hover:border-coral-300 dark:border-navy-800 dark:bg-navy-900 dark:hover:border-navy-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="mt-0.5 shrink-0 text-coral-500 focus:outline-none"
                aria-label={`Toggle topic ${topic.title}`}
              >
                {topic.completed ? (
                  <CheckCircle2 className="h-5 w-5 fill-coral-100 dark:fill-coral-950" />
                ) : (
                  <Circle className="h-5 w-5 text-navy-400 dark:text-cream-400" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-cream-200 px-2 py-0.5 text-[10px] font-bold text-navy-800 dark:bg-navy-800 dark:text-cream-200">
                    {topic.category}
                  </span>
                  <h4
                    className={`font-serif text-base font-bold ${
                      topic.completed
                        ? 'line-through text-navy-600 dark:text-cream-300/70'
                        : 'text-navy-900 dark:text-cream-100'
                    }`}
                  >
                    {topic.title}
                  </h4>
                </div>
                {topic.description && (
                  <p className="mt-1 text-xs text-navy-600/80 dark:text-cream-300/60 leading-relaxed">
                    {topic.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
