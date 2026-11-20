import {
  AppStateData,
  ItemStatus,
  Milestone,
  ProjectItem,
  JobApplication,
  DsaTrack,
} from '../types';
import dsaData from '../data/dsa.json';
import { initialDevelopmentMilestones } from '../data/development';
import { initialAiToolsMilestones } from '../data/aiTools';
import { initialCsFundTopics } from '../data/csFundamentals';
import { initialProjects, initialApplications } from '../data/projectsAndApps';
import { getFirebaseDb } from './firebase';
import { doc, onSnapshot, setDoc, getDoc, Unsubscribe } from 'firebase/firestore';

export interface ProgressRepo {
  getAll(): Promise<AppStateData>;
  updateItem(itemId: string, status: ItemStatus, notes?: string): Promise<void>;
  updateMilestoneConcept(milestoneId: string, conceptId: string, done: boolean): Promise<void>;
  updateMilestoneProof(
    milestoneId: string,
    proof: { done: boolean; repoUrl?: string; liveUrl?: string }
  ): Promise<void>;
  updateCsTopic(topicId: string, completed: boolean, notes?: string): Promise<void>;
  addProject(project: Omit<ProjectItem, 'id'>): Promise<ProjectItem>;
  updateProject(id: string, updates: Partial<ProjectItem>): Promise<void>;
  deleteProject(id: string): Promise<void>;
  addApplication(app: Omit<JobApplication, 'id'>): Promise<JobApplication>;
  updateApplication(id: string, updates: Partial<JobApplication>): Promise<void>;
  deleteApplication(id: string): Promise<void>;
  recordActivity(date?: string, countIncrement?: number): Promise<void>;
  exportData(): Promise<string>;
  importData(jsonString: string): Promise<boolean>;
  resetAll(): Promise<void>;
  setTheme(theme: 'light' | 'dark'): Promise<void>;
  subscribe(callback: (data: AppStateData) => void): () => void;
  isCloudSyncActive(): boolean;
  reconnectCloud(): void;
}

const STORAGE_KEY = 'placement_prep_tracker_v4_tracked';
const FIRESTORE_COLLECTION = 'placement_tracker';
const FIRESTORE_DOC_ID = 'user_progress';

export function getDefaultInitialState(): AppStateData {
  const milestonesRecord: Record<string, Milestone> = {};
  [...initialDevelopmentMilestones, ...initialAiToolsMilestones].forEach((m) => {
    milestonesRecord[m.id] = m;
  });

  // Preserve initial completed items from the Excel syllabus
  const dsaItemsRecord: Record<
    string,
    { status: ItemStatus; notes?: string; startedAt?: string; completedAt?: string }
  > = {};

  (dsaData as unknown as DsaTrack[]).forEach((track) => {
    track.sections.forEach((sec) => {
      sec.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          if (item.status === 'completed') {
            dsaItemsRecord[item.id] = {
              status: 'completed',
              completedAt: item.completedAt || 'Excel Progress',
            };
          }
        });
      });
    });
  });

  return {
    dsaItems: dsaItemsRecord,
    milestones: milestonesRecord,
    csFundTopics: initialCsFundTopics,
    projects: initialProjects,
    applications: initialApplications,
    activityLogs: {},
    theme: 'light',
  };
}

export class HybridProgressRepo implements ProgressRepo {
  private subscribers: Set<(data: AppStateData) => void> = new Set();
  private cachedState: AppStateData = getDefaultInitialState();
  private isCloudActive = false;
  private firestoreUnsubscribe: Unsubscribe | null = null;

  constructor() {
    this.cachedState = this.readLocalState();
    this.initFirebaseSync();
  }

  isCloudSyncActive(): boolean {
    return this.isCloudActive;
  }

  private readLocalState(): AppStateData {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.cachedState;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedState));
        return this.cachedState;
      }
      const parsed = JSON.parse(raw);
      const state: AppStateData = {
        ...getDefaultInitialState(),
        ...parsed,
        milestones: {
          ...getDefaultInitialState().milestones,
          ...(parsed.milestones || {}),
        },
      };
      return state;
    } catch (e) {
      console.error('Failed reading from LocalStorage:', e);
      return this.cachedState;
    }
  }

  private writeLocalState(state: AppStateData): void {
    this.cachedState = state;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Failed saving to LocalStorage:', err);
      }
    }
    this.notifySubscribers(state);
  }

  private initFirebaseSync(): void {
    const db = getFirebaseDb();
    if (!db) {
      this.isCloudActive = false;
      return;
    }

    if (this.firestoreUnsubscribe) {
      this.firestoreUnsubscribe();
      this.firestoreUnsubscribe = null;
    }

    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

      // Check if doc exists; if not, upload current local state
      getDoc(docRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            this.pushToFirestore(this.cachedState);
          }
        })
        .catch((err) => {
          console.warn('Initial Firestore read error:', err);
        });

      // Listen in real-time
      this.firestoreUnsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            this.isCloudActive = true;
            const remoteData = snapshot.data() as Partial<AppStateData>;
            const merged: AppStateData = {
              ...getDefaultInitialState(),
              ...remoteData,
              milestones: {
                ...getDefaultInitialState().milestones,
                ...(remoteData.milestones || {}),
              },
            };
            this.writeLocalState(merged);
          }
        },
        (err) => {
          console.warn('Firestore snapshot listener error:', err);
          this.isCloudActive = false;
        }
      );

      this.isCloudActive = true;
    } catch (err) {
      console.error('Error starting Firebase sync:', err);
      this.isCloudActive = false;
    }
  }

  reconnectCloud(): void {
    this.initFirebaseSync();
  }

  private async pushToFirestore(state: AppStateData): Promise<void> {
    const db = getFirebaseDb();
    if (!db) return;

    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      // Remove any undefined values by serializing
      const cleanData = JSON.parse(JSON.stringify(state));
      await setDoc(docRef, cleanData, { merge: true });
      this.isCloudActive = true;
    } catch (err) {
      console.warn('Failed pushing to Firestore:', err);
    }
  }

  private saveState(state: AppStateData): void {
    this.writeLocalState(state);
    if (this.isCloudActive) {
      this.pushToFirestore(state);
    }
  }

  private notifySubscribers(state: AppStateData): void {
    this.subscribers.forEach((cb) => {
      try {
        cb(state);
      } catch (e) {
        console.error('Subscriber callback error:', e);
      }
    });
  }

  async getAll(): Promise<AppStateData> {
    return this.cachedState;
  }

  async updateItem(itemId: string, status: ItemStatus, notes?: string): Promise<void> {
    const state = this.cachedState;
    const existing = state.dsaItems[itemId] || { status: 'pending' };
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    let startedAt = existing.startedAt;
    let completedAt = existing.completedAt;

    if (status === 'in_progress') {
      if (!startedAt) startedAt = now;
      completedAt = undefined;
    } else if (status === 'completed') {
      if (!startedAt) startedAt = now;
      completedAt = now;
    } else if (status === 'pending') {
      startedAt = undefined;
      completedAt = undefined;
    }

    const updated = {
      ...existing,
      status,
      notes: notes !== undefined ? notes : existing.notes,
      startedAt,
      completedAt,
    };

    const nextDsaItems = {
      ...state.dsaItems,
      [itemId]: updated,
    };

    const nextActivity = { ...state.activityLogs };
    if (status === 'completed') {
      nextActivity[today] = (nextActivity[today] || 0) + 1;
    }

    this.saveState({
      ...state,
      dsaItems: nextDsaItems,
      activityLogs: nextActivity,
    });
  }

  async updateMilestoneConcept(milestoneId: string, conceptId: string, done: boolean): Promise<void> {
    const state = this.cachedState;
    const milestone = state.milestones[milestoneId];
    if (!milestone) return;

    const nextConcepts = milestone.concepts.map((c) =>
      c.id === conceptId ? { ...c, done } : c
    );

    const today = new Date().toISOString().split('T')[0];
    const nextActivity = { ...state.activityLogs };
    if (done) {
      nextActivity[today] = (nextActivity[today] || 0) + 1;
    }

    this.saveState({
      ...state,
      milestones: {
        ...state.milestones,
        [milestoneId]: {
          ...milestone,
          concepts: nextConcepts,
        },
      },
      activityLogs: nextActivity,
    });
  }

  async updateMilestoneProof(
    milestoneId: string,
    proofUpdate: { done: boolean; repoUrl?: string; liveUrl?: string }
  ): Promise<void> {
    const state = this.cachedState;
    const milestone = state.milestones[milestoneId];
    if (!milestone) return;

    const today = new Date().toISOString().split('T')[0];
    const nextActivity = { ...state.activityLogs };
    if (proofUpdate.done && !milestone.proof.done) {
      nextActivity[today] = (nextActivity[today] || 0) + 2;
    }

    this.saveState({
      ...state,
      milestones: {
        ...state.milestones,
        [milestoneId]: {
          ...milestone,
          proof: {
            ...milestone.proof,
            ...proofUpdate,
          },
        },
      },
      activityLogs: nextActivity,
    });
  }

  async updateCsTopic(topicId: string, completed: boolean, notes?: string): Promise<void> {
    const state = this.cachedState;
    const today = new Date().toISOString().split('T')[0];
    const nextTopics = state.csFundTopics.map((t) => {
      if (t.id === topicId) {
        return {
          ...t,
          completed,
          notes: notes !== undefined ? notes : t.notes,
          completedAt: completed ? t.completedAt || today : undefined,
        };
      }
      return t;
    });

    const nextActivity = { ...state.activityLogs };
    if (completed) {
      nextActivity[today] = (nextActivity[today] || 0) + 1;
    }

    this.saveState({
      ...state,
      csFundTopics: nextTopics,
      activityLogs: nextActivity,
    });
  }

  async addProject(project: Omit<ProjectItem, 'id'>): Promise<ProjectItem> {
    const state = this.cachedState;
    const newProject: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    this.saveState({
      ...state,
      projects: [newProject, ...state.projects],
    });
    return newProject;
  }

  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<void> {
    const state = this.cachedState;
    this.saveState({
      ...state,
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  }

  async deleteProject(id: string): Promise<void> {
    const state = this.cachedState;
    this.saveState({
      ...state,
      projects: state.projects.filter((p) => p.id !== id),
    });
  }

  async addApplication(app: Omit<JobApplication, 'id'>): Promise<JobApplication> {
    const state = this.cachedState;
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`,
    };
    this.saveState({
      ...state,
      applications: [newApp, ...state.applications],
    });
    return newApp;
  }

  async updateApplication(id: string, updates: Partial<JobApplication>): Promise<void> {
    const state = this.cachedState;
    this.saveState({
      ...state,
      applications: state.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  }

  async deleteApplication(id: string): Promise<void> {
    const state = this.cachedState;
    this.saveState({
      ...state,
      applications: state.applications.filter((a) => a.id !== id),
    });
  }

  async recordActivity(date?: string, countIncrement = 1): Promise<void> {
    const state = this.cachedState;
    const day = date || new Date().toISOString().split('T')[0];
    const current = state.activityLogs[day] || 0;
    this.saveState({
      ...state,
      activityLogs: {
        ...state.activityLogs,
        [day]: current + countIncrement,
      },
    });
  }

  async exportData(): Promise<string> {
    return JSON.stringify(this.cachedState, null, 2);
  }

  async importData(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || !parsed) return false;
      const nextState = {
        ...getDefaultInitialState(),
        ...parsed,
      };
      this.saveState(nextState);
      return true;
    } catch {
      return false;
    }
  }

  async resetAll(): Promise<void> {
    const fresh = getDefaultInitialState();
    this.saveState(fresh);
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    const state = this.cachedState;
    this.saveState({
      ...state,
      theme,
    });
  }

  subscribe(callback: (data: AppStateData) => void): () => void {
    this.subscribers.add(callback);
    callback(this.cachedState);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

// Singleton repository instance
export const progressRepo: ProgressRepo = new HybridProgressRepo();
