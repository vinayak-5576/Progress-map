import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ProjectItem } from '../types';

export const ProjectsPage: React.FC = () => {
  const { data, addProject, updateProject, deleteProject } = useAppStore();

  const [showAddProj, setShowAddProj] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projRepo, setProjRepo] = useState('');
  const [projLive, setProjLive] = useState('');

  const projects = data?.projects || [];

  const handleCreateProj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;
    await addProject({
      name: projName.trim(),
      description: projDesc.trim() || undefined,
      stack: projStack ? projStack.split(',').map((s) => s.trim()).filter(Boolean) : [],
      repoUrl: projRepo.trim() || undefined,
      link: projLive.trim() || undefined,
      status: 'In Progress',
    });
    setProjName('');
    setProjDesc('');
    setProjStack('');
    setProjRepo('');
    setProjLive('');
    setShowAddProj(false);
  };

  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const planningCount = projects.filter((p) => p.status === 'Planning').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Portfolio Flagship Builds</span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
            Flagship Software Projects
          </h1>
          <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
            Showcase 2–3 high-caliber, deployed full-stack or AI architectures with clean code, CI/CD, and system design diagrams.
          </p>
        </div>

        <button
          onClick={() => setShowAddProj(!showAddProj)}
          className="inline-flex items-center gap-2 rounded-2xl bg-coral-500 px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 hover:shadow-glow-coral self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Overview Stats Card */}
      <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
              Portfolio Strength
            </h3>
            <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
              Target: 2-3 flagship projects deployed live with architecture in README
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold text-coral-500">{completedCount}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                Shipped
              </span>
            </div>
            <div className="h-8 w-px bg-cream-300 dark:bg-navy-800" />
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold text-amber-500">{inProgressCount}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                Building
              </span>
            </div>
            <div className="h-8 w-px bg-cream-300 dark:bg-navy-800" />
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold text-navy-700 dark:text-cream-300">{planningCount}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-600/70 dark:text-cream-300/60">
                Planning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Add Project Form */}
      {showAddProj && (
        <form
          onSubmit={handleCreateProj}
          className="rounded-3xl border border-cream-300 bg-cream-50 p-6 sm:p-8 shadow-soft dark:border-navy-800 dark:bg-navy-900 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-navy-800">
            <h3 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100">
              Log Flagship Project
            </h3>
            <span className="text-xs text-navy-600/70 dark:text-cream-300/50">
              Full-Stack / Distributed / AI System
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Real-Time Collaborative Canvas, Distributed Task Queue"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Redis, WebSockets, PostgreSQL"
                value={projStack}
                onChange={(e) => setProjStack(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={projRepo}
                onChange={(e) => setProjRepo(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                Live Demo / Deployment URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={projLive}
                onChange={(e) => setProjLive(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                Description & Key Highlights
              </label>
              <textarea
                rows={3}
                placeholder="Describe problem solved, distributed bottlenecks handled, database indexing/caching decisions, or algorithmic approach..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-100 p-3 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddProj(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-navy-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-coral-500 px-4 py-2 text-xs font-semibold text-white hover:bg-coral-600 shadow-soft"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* 4. Projects Cards Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl border border-cream-300/80 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-serif text-xl font-bold text-navy-900 dark:text-cream-100 leading-snug">
                      {proj.name}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={proj.status}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        status: e.target.value as ProjectItem['status'],
                        completedAt: e.target.value === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
                      })
                    }
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold border cursor-pointer ${
                      proj.status === 'Completed'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : proj.status === 'In Progress'
                        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'border-cream-300 bg-cream-100 text-navy-700 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-300'
                    }`}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {proj.description && (
                  <p className="mt-3 text-xs text-navy-600/80 dark:text-cream-300/60 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {/* Tech Stack Chips */}
                {proj.stack && proj.stack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.stack.map((st) => (
                      <span
                        key={st}
                        className="rounded-lg bg-cream-200/80 px-2 py-0.5 text-[11px] font-medium text-navy-800 dark:bg-navy-800 dark:text-cream-200"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Links & Actions */}
              <div className="mt-6 pt-4 border-t border-cream-200/70 dark:border-navy-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-navy-800 hover:text-coral-500 dark:text-cream-200 dark:hover:text-coral-400"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-coral-500 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live App</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete project"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-8 text-center dark:border-navy-800 dark:bg-navy-900">
          <FolderGit2 className="mx-auto h-8 w-8 text-coral-500" />
          <h3 className="mt-2 font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
            No projects logged yet
          </h3>
          <p className="mt-1 text-xs text-navy-600/70 dark:text-cream-300/50 max-w-sm mx-auto">
            Click "New Project" to add your flagship builds, repositories, and live deployment links!
          </p>
        </div>
      )}
    </div>
  );
};
