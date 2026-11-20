import { create } from 'zustand';
import {
  AppStateData,
  ItemStatus,
  ProjectItem,
  JobApplication,
  AreaProgressSummary,
  DsaTrack,
  StudyCategory,
  StudySession,
} from '../types';
import { progressRepo } from '../lib/storage';
import dsaData from '../data/dsa.json';

interface AppStoreState {
  data: AppStateData | null;
  dsaTracks: DsaTrack[];
  isLoading: boolean;
  selectedTrackId: string;

  // Actions
  init: () => Promise<void>;
  setDsaTracks: (tracks: DsaTrack[]) => void;
  setSelectedTrackId: (trackId: string) => void;
  toggleDsaItem: (itemId: string, currentStatus: ItemStatus) => Promise<void>;
  setDsaItemStatus: (itemId: string, status: ItemStatus) => Promise<void>;
  updateDsaNotes: (itemId: string, notes: string) => Promise<void>;
  toggleMilestoneConcept: (milestoneId: string, conceptId: string) => Promise<void>;
  updateMilestoneProof: (
    milestoneId: string,
    proof: { done: boolean; repoUrl?: string; liveUrl?: string }
  ) => Promise<void>;
  toggleCsTopic: (topicId: string) => Promise<void>;
  updateCsTopicNotes: (topicId: string, notes: string) => Promise<void>;
  addProject: (project: Omit<ProjectItem, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addApplication: (app: Omit<JobApplication, 'id'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt'>) => Promise<void>;
  deleteStudySession: (id: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonStr: string) => Promise<boolean>;
  resetAll: () => Promise<void>;

  // Selectors / Getters
  getOverallReadiness: () => number;
  getAreaSummaries: () => AreaProgressSummary[];
  getCurrentStreak: () => number;
  getContinueRecommendation: () => {
    title: string;
    subtitle: string;
    route: string;
    tag: string;
    actionLabel?: string;
  };
  get30DayActivity: () => { date: string; count: number; dayName: string }[];
  getWeeklyActivity: () => { day: string; date: string; count: number }[];
  getTodayStudyMinutes: () => number;
  getWeekStudyMinutes: () => number;
  getTotalStudyMinutes: () => number;
  getStudyCategoryBreakdown: () => { category: StudyCategory; minutes: number; percentage: number }[];
  getRecentStudySessions: (limit?: number) => StudySession[];
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  data: null,
  dsaTracks: (dsaData as unknown as DsaTrack[]) || [],
  isLoading: true,
  selectedTrackId: (dsaData as unknown as DsaTrack[])[0]?.id || 'track-main',

  init: async () => {
    const data = await progressRepo.getAll();
    set({ data, isLoading: false });

    // Apply theme to document
    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Subscribe to external repo updates
    progressRepo.subscribe((updatedData) => {
      set({ data: updatedData });
      if (updatedData.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  },

  setDsaTracks: (tracks: DsaTrack[]) => {
    set({
      dsaTracks: tracks,
      selectedTrackId: tracks.length > 0 ? tracks[0].id : 'track-main',
    });
  },

  setSelectedTrackId: (trackId: string) => {
    set({ selectedTrackId: trackId });
  },

  toggleDsaItem: async (itemId: string, currentStatus: ItemStatus) => {
    const nextStatus: ItemStatus =
      currentStatus === 'completed'
        ? 'pending'
        : currentStatus === 'pending'
        ? 'in_progress'
        : 'completed';
    await progressRepo.updateItem(itemId, nextStatus);
  },

  setDsaItemStatus: async (itemId: string, status: ItemStatus) => {
    await progressRepo.updateItem(itemId, status);
  },

  updateDsaNotes: async (itemId: string, notes: string) => {
    const current = get().data?.dsaItems[itemId];
    await progressRepo.updateItem(itemId, current?.status || 'pending', notes);
  },

  toggleMilestoneConcept: async (milestoneId: string, conceptId: string) => {
    const milestone = get().data?.milestones[milestoneId];
    if (!milestone) return;
    const concept = milestone.concepts.find((c) => c.id === conceptId);
    if (!concept) return;
    await progressRepo.updateMilestoneConcept(milestoneId, conceptId, !concept.done);
  },

  updateMilestoneProof: async (milestoneId: string, proof) => {
    await progressRepo.updateMilestoneProof(milestoneId, proof);
  },

  toggleCsTopic: async (topicId: string) => {
    const topic = get().data?.csFundTopics.find((t) => t.id === topicId);
    if (!topic) return;
    await progressRepo.updateCsTopic(topicId, !topic.completed);
  },

  updateCsTopicNotes: async (topicId: string, notes: string) => {
    const topic = get().data?.csFundTopics.find((t) => t.id === topicId);
    if (!topic) return;
    await progressRepo.updateCsTopic(topicId, topic.completed, notes);
  },

  addProject: async (project) => {
    await progressRepo.addProject(project);
  },

  updateProject: async (id, updates) => {
    await progressRepo.updateProject(id, updates);
  },

  deleteProject: async (id) => {
    await progressRepo.deleteProject(id);
  },

  addApplication: async (app) => {
    await progressRepo.addApplication(app);
  },

  updateApplication: async (id, updates) => {
    await progressRepo.updateApplication(id, updates);
  },

  deleteApplication: async (id) => {
    await progressRepo.deleteApplication(id);
  },

  addStudySession: async (session) => {
    await progressRepo.addStudySession(session);
  },

  deleteStudySession: async (id) => {
    await progressRepo.deleteStudySession(id);
  },

  toggleTheme: async () => {
    const current = get().data?.theme || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    await progressRepo.setTheme(next);
  },

  exportData: async () => {
    return progressRepo.exportData();
  },

  importData: async (jsonStr: string) => {
    const success = await progressRepo.importData(jsonStr);
    if (success) {
      const refreshed = await progressRepo.getAll();
      set({ data: refreshed });
    }
    return success;
  },

  resetAll: async () => {
    await progressRepo.resetAll();
    const refreshed = await progressRepo.getAll();
    set({ data: refreshed });
  },

  getAreaSummaries: (): AreaProgressSummary[] => {
    const { data, dsaTracks } = get();
    if (!data) return [];

    // 1. DSA Calculation
    let dsaTotal = 0;
    let dsaCompleted = 0;

    dsaTracks.forEach((track) => {
      track.sections.forEach((sec) => {
        sec.subsections.forEach((sub) => {
          sub.items.forEach((item) => {
            dsaTotal++;
            const override = data.dsaItems[item.id];
            const effectiveStatus = override ? override.status : item.status;
            if (effectiveStatus === 'completed') {
              dsaCompleted++;
            }
          });
        });
      });
    });

    // Fallback if dsa.json is still loading
    if (dsaTotal === 0) {
      dsaTotal = 1;
      dsaCompleted = 0;
    }
    const dsaPercentage = Math.round((dsaCompleted / Math.max(1, dsaTotal)) * 100);

    // 2. Development Calculation
    const devMilestones = Object.values(data.milestones).filter((m) => m.areaId === 'development');
    let devProgressSum = 0;
    let devConceptsTotal = 0;
    let devConceptsDone = 0;

    devMilestones.forEach((m) => {
      const cTotal = m.concepts.length;
      const cDone = m.concepts.filter((c) => c.done).length;
      devConceptsTotal += cTotal;
      devConceptsDone += cDone;
      const conceptPct = cTotal > 0 ? (cDone / cTotal) * 100 : 0;
      const proofPct = m.proof.done ? 100 : 0;
      devProgressSum += (conceptPct * 0.7) + (proofPct * 0.3); // 70% concepts, 30% proof
    });
    const devPercentage = devMilestones.length > 0 ? Math.round(devProgressSum / devMilestones.length) : 0;

    // 3. AI & AI Tools Calculation
    const aiMilestones = Object.values(data.milestones).filter((m) => m.areaId === 'ai-tools');
    let aiProgressSum = 0;
    let aiConceptsTotal = 0;
    let aiConceptsDone = 0;

    aiMilestones.forEach((m) => {
      const cTotal = m.concepts.length;
      const cDone = m.concepts.filter((c) => c.done).length;
      aiConceptsTotal += cTotal;
      aiConceptsDone += cDone;
      const conceptPct = cTotal > 0 ? (cDone / cTotal) * 100 : 0;
      const proofPct = m.proof.done ? 100 : 0;
      aiProgressSum += (conceptPct * 0.7) + (proofPct * 0.3);
    });
    const aiPercentage = aiMilestones.length > 0 ? Math.round(aiProgressSum / aiMilestones.length) : 0;

    // 4. CS Fundamentals Calculation
    const csTopics = data.csFundTopics;
    const csCompleted = csTopics.filter((t) => t.completed).length;
    const csPercentage = csTopics.length > 0 ? Math.round((csCompleted / csTopics.length) * 100) : 0;

    // 5. Projects Calculation
    const projCompleted = data.projects.filter((p) => p.status === 'Completed').length;
    const projTotal = Math.max(3, data.projects.length);
    const projPercentage = data.projects.length > 0 ? Math.min(100, Math.round((projCompleted / projTotal) * 100)) : 0;

    // 6. Internships & Applications Calculation
    const appOffers = data.applications.filter((a) => a.status === 'Offer').length;
    const appInterviews = data.applications.filter((a) => a.status === 'Interview').length;
    const appOa = data.applications.filter((a) => a.status === 'OA').length;
    const appApplied = data.applications.length;
    const appScore = Math.min(100, (appOffers * 50) + (appInterviews * 25) + (appOa * 15) + (appApplied * 5));

    return [
      {
        id: 'dsa',
        title: 'DSA Practice',
        completed: dsaCompleted,
        total: dsaTotal,
        percentage: dsaPercentage,
        weight: 0.35,
        route: '/dsa',
        icon: 'Binary',
      },
      {
        id: 'development',
        title: 'Development Roadmap',
        completed: devConceptsDone,
        total: devConceptsTotal,
        percentage: devPercentage,
        weight: 0.25,
        route: '/development',
        icon: 'Code2',
      },
      {
        id: 'ai-tools',
        title: 'AI & AI Tools Roadmap',
        completed: aiConceptsDone,
        total: aiConceptsTotal,
        percentage: aiPercentage,
        weight: 0.20,
        route: '/ai-tools',
        icon: 'Sparkles',
      },
      {
        id: 'cs-fundamentals',
        title: 'CS Fundamentals',
        completed: csCompleted,
        total: csTopics.length,
        percentage: csPercentage,
        weight: 0.10,
        route: '/cs-fundamentals',
        icon: 'BookOpen',
      },
      {
        id: 'projects',
        title: 'Flagship Projects',
        completed: projCompleted,
        total: projTotal,
        percentage: projPercentage,
        weight: 0.05,
        route: '/projects',
        icon: 'FolderGit2',
      },
      {
        id: 'internships',
        title: 'Internships & Drives',
        completed: data.applications.length,
        total: 26, // 26 programs from PDF roadmap
        percentage: appScore,
        weight: 0.05,
        route: '/internships',
        icon: 'Briefcase',
      },
    ];
  },

  getOverallReadiness: (): number => {
    const summaries = get().getAreaSummaries();
    if (summaries.length === 0) return 0;
    const weightedSum = summaries.reduce((acc, s) => acc + s.percentage * s.weight, 0);
    return Math.round(weightedSum);
  },

  getCurrentStreak: (): number => {
    const logs = get().data?.activityLogs || {};
    const dates = Object.keys(logs).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(today);

    // If today hasn't had any activity, check if yesterday had activity to continue streak
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!logs[todayStr] || logs[todayStr] === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (logs[dStr] && logs[dStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  getContinueRecommendation: () => {
    const { data, dsaTracks } = get();
    if (!data) {
      return {
        title: 'Start with Basics',
        subtitle: 'Begin Section 1: Basics of programming in DSA',
        route: '/dsa',
        tag: 'DSA',
        actionLabel: 'Start Practice',
      };
    }

    // 1. Flatten all DSA items with section & subsection hierarchy
    interface FlatDsaItem {
      id: string;
      title: string;
      sectionTitle: string;
      subsectionTitle: string;
      status: ItemStatus;
      completedAt?: string;
      startedAt?: string;
    }

    const flatDsa: FlatDsaItem[] = [];
    dsaTracks.forEach((track) => {
      track.sections.forEach((sec) => {
        sec.subsections.forEach((sub) => {
          sub.items.forEach((it) => {
            const override = data.dsaItems[it.id];
            const effectiveStatus = override ? override.status : it.status;
            flatDsa.push({
              id: it.id,
              title: it.title,
              sectionTitle: sec.title,
              subsectionTitle: sub.title,
              status: effectiveStatus,
              completedAt: override?.completedAt || (it.status === 'completed' ? it.completedAt : undefined),
              startedAt: override?.startedAt || it.startedAt,
            });
          });
        });
      });
    });

    // Priority 1: Any item currently marked in_progress!
    const inProgressDsa = flatDsa.filter((x) => x.status === 'in_progress');
    if (inProgressDsa.length > 0) {
      const active = inProgressDsa[0];
      return {
        title: active.title,
        subtitle: `Currently In Progress • ${active.sectionTitle} > ${active.subsectionTitle}`,
        route: '/dsa',
        tag: 'DSA',
        actionLabel: 'Resume Problem',
      };
    }

    // Priority 2: If user has actively started Development (at least 1 concept checked done in active milestone)
    const devMilestones = Object.values(data.milestones)
      .filter((m) => m.areaId === 'development')
      .sort((a, b) => a.order - b.order);
    const activeDev = devMilestones.find(
      (m) => m.concepts.some((c) => c.done) && (!m.proof.done || m.concepts.some((c) => !c.done))
    );
    if (activeDev) {
      const nextConcept = activeDev.concepts.find((c) => !c.done);
      return {
        title: nextConcept ? nextConcept.label : `Submit Proof: ${activeDev.title}`,
        subtitle: `Development: Milestone ${activeDev.order} (${activeDev.title})`,
        route: '/development',
        tag: 'Development',
        actionLabel: 'Resume Milestone',
      };
    }

    // Priority 3: If user has actively started AI & Tools (at least 1 concept checked done)
    const aiMilestones = Object.values(data.milestones)
      .filter((m) => m.areaId === 'ai-tools')
      .sort((a, b) => a.order - b.order);
    const activeAi = aiMilestones.find(
      (m) => m.concepts.some((c) => c.done) && (!m.proof.done || m.concepts.some((c) => !c.done))
    );
    if (activeAi) {
      const nextConcept = activeAi.concepts.find((c) => !c.done);
      return {
        title: nextConcept ? nextConcept.label : `Submit Proof: ${activeAi.title}`,
        subtitle: `AI Tools: Milestone ${activeAi.order} (${activeAi.title})`,
        route: '/ai-tools',
        tag: 'AI Tools',
        actionLabel: 'Resume Milestone',
      };
    }

    // Priority 4: Next uncompleted DSA problem following user's progress!
    // Find the last completed item in the syllabus order
    let lastCompletedIndex = -1;
    flatDsa.forEach((x, idx) => {
      if (x.status === 'completed') {
        lastCompletedIndex = idx;
      }
    });

    if (lastCompletedIndex >= 0) {
      // Find the first pending item after or at that index
      const nextPending =
        flatDsa.slice(lastCompletedIndex + 1).find((x) => x.status === 'pending') ||
        flatDsa.find((x) => x.status === 'pending');

      if (nextPending) {
        return {
          title: nextPending.title,
          subtitle: `Next Up in Syllabus • ${nextPending.sectionTitle} > ${nextPending.subsectionTitle}`,
          route: '/dsa',
          tag: 'DSA',
          actionLabel: 'Solve Problem',
        };
      }
    }

    // Priority 5: First problem in DSA syllabus
    const firstPending = flatDsa.find((x) => x.status === 'pending') || flatDsa[0];
    if (firstPending) {
      return {
        title: firstPending.title,
        subtitle: `Start Here • ${firstPending.sectionTitle} > ${firstPending.subsectionTitle}`,
        route: '/dsa',
        tag: 'DSA',
        actionLabel: 'Start Problem',
      };
    }

    return {
      title: 'Practice DSA Trees & Graphs',
      subtitle: 'Continue daily LeetCode practice session',
      route: '/dsa',
      tag: 'DSA',
      actionLabel: 'Open DSA',
    };
  },

  get30DayActivity: () => {
    const logs = get().data?.activityLogs || {};
    const result = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = logs[dateStr] || 0;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      result.push({ date: dateStr, count, dayName });
    }

    return result;
  },

  getWeeklyActivity: () => {
    const logs = get().data?.activityLogs || {};
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = logs[dateStr] || 0;
      result.push({ day: dayName, date: dateStr, count });
    }

    return result;
  },

  getTodayStudyMinutes: () => {
    const sessions = get().data?.studySessions || [];
    const today = new Date().toISOString().split('T')[0];
    return sessions
      .filter((s) => s.date === today)
      .reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  },

  getWeekStudyMinutes: () => {
    const sessions = get().data?.studySessions || [];
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return sessions
      .filter((s) => s.date >= weekAgoStr)
      .reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  },

  getTotalStudyMinutes: () => {
    const sessions = get().data?.studySessions || [];
    return sessions.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  },

  getStudyCategoryBreakdown: () => {
    const sessions = get().data?.studySessions || [];
    const totals: Record<StudyCategory, number> = {
      DSA: 0,
      Development: 0,
      'AI & Tools': 0,
      'CS Fundamentals': 0,
      Projects: 0,
      General: 0,
    };

    let total = 0;
    sessions.forEach((s) => {
      const cat = (s.category || 'General') as StudyCategory;
      if (totals[cat] !== undefined) {
        totals[cat] += s.minutes || 0;
      } else {
        totals.General += s.minutes || 0;
      }
      total += s.minutes || 0;
    });

    const categories: StudyCategory[] = [
      'DSA',
      'Development',
      'AI & Tools',
      'CS Fundamentals',
      'Projects',
      'General',
    ];

    return categories.map((cat) => ({
      category: cat,
      minutes: totals[cat],
      percentage: total > 0 ? Math.round((totals[cat] / total) * 100) : 0,
    }));
  },

  getRecentStudySessions: (limit = 10) => {
    const sessions = get().data?.studySessions || [];
    return [...sessions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));
