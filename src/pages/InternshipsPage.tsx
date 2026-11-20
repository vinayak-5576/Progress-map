import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  Plus,
  MapPin,
  IndianRupee,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ApplicationStatus } from '../types';
import { InternshipProgramsWidget } from '../components/dashboard/InternshipProgramsWidget';

export const InternshipsPage: React.FC = () => {
  const { data, addApplication, deleteApplication } = useAppStore();
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'applications'>('programs');

  const [showAddApp, setShowAddApp] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('Applied');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    await addApplication({
      company,
      role,
      status: appStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      salaryOrStipend: salary || undefined,
      location: location || undefined,
      notes: notes || undefined,
    });
    setCompany('');
    setRole('');
    setSalary('');
    setLocation('');
    setNotes('');
    setShowAddApp(false);
  };

  const statusBadge = (st: ApplicationStatus) => {
    const map: Record<ApplicationStatus, string> = {
      Offer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
      Interview: 'bg-coral-100 text-coral-700 dark:bg-coral-950 dark:text-coral-300 border-coral-200',
      OA: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
      Applied: 'bg-cream-200 text-navy-800 dark:bg-navy-800 dark:text-cream-200 border-cream-300',
      Rejected: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200',
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${map[st] || 'bg-cream-200'}`}>
        {st}
      </span>
    );
  };

  const applications = data?.applications || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* 1. Header & View Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-950/60 dark:text-coral-300">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Opportunities & Drives</span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 dark:text-cream-100">
            Internship Programs & Job Pipeline
          </h1>
          <p className="mt-1 text-sm text-navy-600/80 dark:text-cream-300/60">
            26 verified national & global opportunities from your PDF roadmap alongside your active application pipeline.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex rounded-2xl border border-cream-300 bg-cream-50 p-1 dark:border-navy-800 dark:bg-navy-900 shadow-soft-sm shrink-0">
          <button
            onClick={() => setActiveSubTab('programs')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeSubTab === 'programs'
                ? 'bg-navy-900 text-cream-100 shadow-sm dark:bg-coral-500 dark:text-navy-950'
                : 'text-navy-700 hover:text-navy-950 dark:text-cream-300'
            }`}
          >
            Programs Roadmap (26)
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeSubTab === 'applications'
                ? 'bg-navy-900 text-cream-100 shadow-sm dark:bg-coral-500 dark:text-navy-950'
                : 'text-navy-700 hover:text-navy-950 dark:text-cream-300'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* 2. Main Content based on Sub-tab */}
      {activeSubTab === 'programs' ? (
        <InternshipProgramsWidget />
      ) : (
        <div className="space-y-6">
          {/* Applications Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900 dark:text-cream-100">
                Active Application Pipeline
              </h2>
              <p className="text-xs text-navy-600/70 dark:text-cream-300/50">
                Track off-campus drives, referrals, and campus recruitment stages
              </p>
            </div>

            <button
              onClick={() => setShowAddApp(!showAddApp)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-coral-500 px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-coral-600 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Log Application</span>
            </button>
          </div>

          {/* Form */}
          {showAddApp && (
            <form
              onSubmit={handleCreateApp}
              className="rounded-3xl border border-cream-300 bg-cream-50 p-6 shadow-soft dark:border-navy-800 dark:bg-navy-900 space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                New Application Entry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Atlassian, Cisco"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering Intern, SDE 1"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Current Stage
                  </label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value as ApplicationStatus)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="OA">OA (Online Assessment)</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Compensation / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,25,000 / month or ₹24 LPA"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Hyderabad, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 dark:text-cream-200 mb-1">
                    Notes & Next Steps
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Referral submitted, interview round scheduled next Tuesday"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-100 px-3 py-2 text-xs text-navy-900 dark:border-navy-700 dark:bg-navy-850 dark:text-cream-100 focus:outline-none focus:border-coral-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddApp(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-cream-200 dark:text-cream-300 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-coral-500 px-4 py-2 text-xs font-semibold text-white hover:bg-coral-600 shadow-soft"
                >
                  Save Application
                </button>
              </div>
            </form>
          )}

          {/* Applications Cards List */}
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-cream-300/80 bg-cream-50 p-5 shadow-soft-sm dark:border-navy-800 dark:bg-navy-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Building className="h-4 w-4 text-coral-500 shrink-0" />
                      <h4 className="font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                        {app.company}
                      </h4>
                      {statusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-navy-700 dark:text-cream-200">
                      <span>{app.role}</span>
                      {app.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-navy-600 dark:text-cream-300">
                            <MapPin className="h-3 w-3" />
                            <span>{app.location}</span>
                          </span>
                        </>
                      )}
                      {app.salaryOrStipend && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-coral-600 dark:text-coral-400 font-semibold">
                            <IndianRupee className="h-3 w-3" />
                            <span>{app.salaryOrStipend}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-xs text-navy-600/80 dark:text-cream-300/60 leading-relaxed italic">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-navy-600/80 dark:text-cream-300/60 gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-cream-200 dark:border-navy-800 shrink-0">
                    <span>Applied: {app.appliedDate}</span>
                    <button
                      type="button"
                      onClick={() => deleteApplication(app.id)}
                      className="text-red-500 hover:text-red-700 text-xs inline-flex items-center gap-1 p-1"
                      title="Remove application entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-cream-300/80 bg-cream-50 p-8 text-center dark:border-navy-800 dark:bg-navy-900">
              <Building className="mx-auto h-8 w-8 text-coral-500" />
              <h3 className="mt-2 font-serif text-lg font-bold text-navy-900 dark:text-cream-100">
                No active applications logged yet
              </h3>
              <p className="mt-1 text-xs text-navy-600/70 dark:text-cream-300/50 max-w-sm mx-auto">
                Explore the 26 opportunities in the Programs Roadmap tab and click "Track" or use "Log Application" above!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
