import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { internshipPrograms, InternshipProgram } from '../../data/internshipPrograms';
import { useAppStore } from '../../store/useAppStore';

export const InternshipProgramsWidget: React.FC = () => {
  const { addApplication } = useAppStore();

  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const quarters = [
    { id: 'All', label: 'All Quarters', count: 26 },
    { id: 'Qtr1', label: 'Qtr 1 (Jul - Sep)', count: 5 },
    { id: 'Qtr2', label: 'Qtr 2 (Oct - Dec)', count: 3 },
    { id: 'Qtr3', label: 'Qtr 3 (Jan - Mar)', count: 7 },
    { id: 'Qtr4', label: 'Qtr 4 (Apr - Jun)', count: 7 },
    { id: 'All-Year', label: 'Year-Round', count: 4 },
  ];

  const categories = ['All', 'Hackathon', 'Internship', 'Research', 'Fellowship', 'Govt Scheme'];

  const filteredPrograms = useMemo(() => {
    return internshipPrograms.filter((p) => {
      // Quarter filter
      if (selectedQuarter === 'All-Year') {
        if (p.quarter !== 'All') return false;
      } else if (selectedQuarter !== 'All') {
        if (p.quarter !== selectedQuarter && p.quarter !== 'All') return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCompany = p.company.toLowerCase().includes(q);
        const matchOpp = p.opportunity.toLowerCase().includes(q);
        const matchMonth = p.tentativeMonth.toLowerCase().includes(q);
        const matchNotes = (p.notes || '').toLowerCase().includes(q);
        if (!matchCompany && !matchOpp && !matchMonth && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [selectedQuarter, selectedCategory, searchQuery]);

  const handleQuickAddApplication = async (prog: InternshipProgram) => {
    await addApplication({
      company: prog.company,
      role: prog.opportunity,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Target Month: ${prog.tentativeMonth} (${prog.quarterLabel}). ${prog.notes || ''}`,
    });
    setAddedIds((prev) => ({ ...prev, [prog.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = { ...prev };
        delete next[prog.id];
        return next;
      });
    }, 2500);
  };

  const getQuarterColor = (quarter: string) => {
    switch (quarter) {
      case 'Qtr1':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Qtr2':
        return 'bg-navy-200/90 text-navy-800 dark:bg-navy-800 dark:text-cream-200 border-navy-300 dark:border-navy-700';
      case 'Qtr3':
        return 'bg-coral-100 text-coral-700 dark:bg-coral-950/70 dark:text-coral-300 border-coral-200 dark:border-coral-900';
      case 'Qtr4':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      default:
        return 'bg-cream-200 text-navy-700 dark:bg-navy-800 dark:text-cream-300 border-cream-300 dark:border-navy-700';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Hackathon':
        return 'bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-200 dark:border-coral-900/60';
      case 'Internship':
        return 'bg-navy-900/10 text-navy-800 dark:text-cream-200 border-navy-200 dark:border-navy-800';
      case 'Research':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50';
      case 'Fellowship':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50';
      default:
        return 'bg-cream-200 text-navy-700 dark:bg-navy-800 dark:text-cream-300 border-cream-300';
    }
  };

  return (
    <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 sm:p-8 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-200 dark:border-navy-800">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral-500 text-white shadow-soft">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-coral-100 px-2.5 py-0.5 text-[10px] font-bold text-coral-600 dark:bg-coral-950 dark:text-coral-300 uppercase tracking-wider">
                PDF Roadmap Verified
              </span>
              <span className="text-xs text-navy-600/70 dark:text-cream-300/50">
                26 Target Opportunities
              </span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
              Upcoming Internship & Hackathon Programs
            </h2>
            <p className="mt-0.5 text-xs text-navy-600/80 dark:text-cream-300/60 max-w-2xl">
              Quarter-by-quarter timeline for top corporate programs (Microsoft, Google, Amazon, Cisco, Goldman Sachs)
              and national research institutions (ISRO, DRDO).
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400 dark:text-cream-400" />
          <input
            type="text"
            placeholder="Search company, hackathon, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-cream-300 bg-cream-100 pl-9 pr-3 py-2 text-xs text-navy-900 placeholder:text-navy-400 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100"
          />
        </div>
      </div>

      {/* 2. Quarter & Category Filters */}
      <div className="mt-5 space-y-3">
        {/* Quarter tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {quarters.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuarter(q.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedQuarter === q.id
                  ? 'bg-navy-900 text-cream-100 shadow-sm dark:bg-coral-500 dark:text-navy-950'
                  : 'bg-cream-200/70 text-navy-700 hover:bg-cream-300/70 dark:bg-navy-800 dark:text-cream-300 dark:hover:bg-navy-750'
              }`}
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-navy-600/60 dark:text-cream-300/40 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-0.5 text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? 'bg-coral-100 text-coral-700 font-bold dark:bg-coral-950/80 dark:text-coral-300'
                  : 'bg-cream-100 text-navy-600 hover:text-navy-900 dark:bg-navy-850 dark:text-cream-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Program Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map((prog) => {
          const isAdded = addedIds[prog.id];

          return (
            <div
              key={prog.id}
              className="group flex flex-col justify-between rounded-2xl border border-cream-300/80 bg-cream-100/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:border-navy-800 dark:bg-navy-950/50"
            >
              <div>
                {/* Header: Company & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-navy-950 dark:text-cream-100 group-hover:text-coral-500 transition-colors">
                      {prog.company}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getCategoryColor(
                      prog.category
                    )}`}
                  >
                    {prog.category}
                  </span>
                </div>

                {/* Opportunity Name */}
                <h4 className="mt-1 text-sm font-semibold text-navy-800 dark:text-cream-200 leading-snug">
                  {prog.opportunity}
                </h4>

                {/* Timeline / Month / Quarter */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold border ${getQuarterColor(
                      prog.quarter
                    )}`}
                  >
                    <Clock className="h-3 w-3" />
                    <span>{prog.tentativeMonth}</span>
                  </span>

                  <span className="text-[10px] text-navy-600/70 dark:text-cream-300/50">
                    ({prog.quarterLabel})
                  </span>
                </div>

                {/* Notes if any */}
                {prog.notes && (
                  <p className="mt-2.5 text-xs text-navy-600/80 dark:text-cream-300/60 leading-relaxed line-clamp-2">
                    {prog.notes}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-cream-200/70 dark:border-navy-850 flex items-center justify-between gap-2">
                <a
                  href={prog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-coral-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral"
                  title={`Open official portal for ${prog.opportunity}`}
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleQuickAddApplication(prog)}
                  disabled={isAdded}
                  className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
                    isAdded
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-cream-300 bg-cream-50 text-navy-700 hover:bg-cream-200 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300 dark:hover:bg-navy-750'
                  }`}
                  title="Add directly to your Applications Log"
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Logged!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      <span className="hidden sm:inline">Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search Result */}
      {filteredPrograms.length === 0 && (
        <div className="mt-8 rounded-2xl border border-cream-200 bg-cream-100/50 p-8 text-center dark:border-navy-800 dark:bg-navy-950/30">
          <p className="font-serif text-base font-bold text-navy-900 dark:text-cream-100">
            No programs match "{searchQuery}"
          </p>
          <p className="text-xs text-navy-600/70 dark:text-cream-300/50 mt-1">
            Try resetting your search query or switching to "All Quarters".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedQuarter('All');
              setSelectedCategory('All');
            }}
            className="mt-3 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-cream-100 dark:bg-coral-500 dark:text-navy-950"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
