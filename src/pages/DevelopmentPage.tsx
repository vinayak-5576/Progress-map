import React from 'react';
import { Code2, Clock, CheckCircle2, Circle, Github, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const DevelopmentPage: React.FC = () => {
  const { data, toggleMilestoneConcept } = useAppStore();
  const devMilestones = data
    ? Object.values(data.milestones)
        .filter((m) => m.areaId === 'development')
        .sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
          <Code2 className="h-3.5 w-3.5" />
          <span>Full Stack Roadmap</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
          Development Roadmap
        </h1>
        <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
          5 production-grade milestones from JS/TS fundamentals through scalable architectures & flagship builds.
        </p>
      </div>

      {/* Stepper Roadmap */}
      <div className="space-y-6">
        {devMilestones.map((m) => {
          const doneConcepts = m.concepts.filter((c) => c.done).length;
          const totalConcepts = m.concepts.length;
          const pct = Math.round((doneConcepts / Math.max(1, totalConcepts)) * 100);

          return (
            <div
              key={m.id}
              className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 sm:p-8 shadow-soft dark:border-navy-800 dark:bg-navy-900 transition-colors"
            >
              {/* Milestone header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-cream-200 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-coral-500 font-serif text-base font-bold text-white shadow-soft">
                    {m.order}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-navy-600/70 dark:text-cream-300/50">
                      <Clock className="h-3.5 w-3.5 text-coral-500" />
                      <span>{m.duration}</span>
                      <span>·</span>
                      <span>{doneConcepts}/{totalConcepts} concepts cleared</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold text-coral-500">{pct}%</span>
                </div>
              </div>

              {/* Core Concepts */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-600/80 dark:text-cream-300/60 mb-2.5">
                  Core Concepts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {m.concepts.map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => toggleMilestoneConcept(m.id, concept.id)}
                      className={`flex items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition border ${
                        concept.done
                          ? 'border-coral-200 bg-coral-50/60 text-navy-900 dark:border-coral-900/50 dark:bg-coral-950/30 dark:text-cream-100'
                          : 'border-cream-200 bg-cream-100 text-navy-700 hover:border-coral-300 dark:border-navy-800 dark:bg-navy-850 dark:text-cream-300'
                      }`}
                    >
                      {concept.done ? (
                        <CheckCircle2 className="h-4 w-4 text-coral-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-navy-400 shrink-0 mt-0.5 dark:text-cream-400" />
                      )}
                      <span className={concept.done ? 'line-through text-navy-600 dark:text-cream-300/70' : 'font-medium'}>
                        {concept.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stack & Tools */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-600/80 dark:text-cream-300/60 mb-2">
                  Stack & Tooling
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {m.stack.map((st) => (
                    <span
                      key={st}
                      className="rounded-lg bg-cream-200 px-2.5 py-1 text-xs font-medium text-navy-800 dark:bg-navy-800 dark:text-cream-200"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proof of work box */}
              <div className="mt-5 rounded-2xl border border-cream-300/80 bg-cream-100 p-4 dark:border-navy-700 dark:bg-navy-850">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-coral-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-cream-100">
                      Proof of Work Deliverable
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      m.proof.done
                        ? 'bg-coral-500 text-white'
                        : 'bg-cream-200 text-navy-600 dark:bg-navy-700 dark:text-cream-300'
                    }`}
                  >
                    {m.proof.done ? 'Verified & Deployed' : 'In Progress'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-navy-700 dark:text-cream-200 leading-relaxed">
                  {m.proof.description}
                </p>
                {m.proof.repoUrl && (
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <a
                      href={m.proof.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-coral-500 hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Source Repository</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
