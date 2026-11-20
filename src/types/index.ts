export type ItemStatus = 'pending' | 'in_progress' | 'completed';

export interface ItemLinks {
  practice?: string;
  practiceTitle?: string;
  isTheory?: boolean;
  video?: string;
  article?: string;
  articleTitle?: string;
}

export interface Item {
  id: string;
  areaId: string;
  sectionId: string;
  subsectionId?: string;
  title: string;
  status: ItemStatus;
  links: ItemLinks;
  notes?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
  startedAt?: string;
  completedAt?: string;
}

export interface DsaSubsection {
  id: string;
  title: string;
  items: Item[];
}

export interface DsaSection {
  id: string;
  title: string;
  subsections: DsaSubsection[];
}

export interface DsaTrack {
  id: string;
  title: string;
  sections: DsaSection[];
}

export interface MilestoneConcept {
  id: string;
  label: string;
  done: boolean;
}

export interface MilestoneProof {
  description: string;
  done: boolean;
  repoUrl?: string;
  liveUrl?: string;
}

export interface Milestone {
  id: string;
  areaId: string; // 'development' | 'ai-tools'
  order: number;
  title: string;
  duration: string;
  concepts: MilestoneConcept[];
  stack: string[];
  proof: MilestoneProof;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface CsFundTopic {
  id: string;
  category: 'OS' | 'DBMS' | 'CN' | 'OOP' | 'System Design';
  title: string;
  description?: string;
  completed: boolean;
  notes?: string;
  completedAt?: string;
}

export type ApplicationStatus = 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  salaryOrStipend?: string;
  location?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  stack: string[];
  link?: string;
  repoUrl?: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  completedAt?: string;
}

export interface AreaProgressSummary {
  id: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
  weight: number;
  route: string;
  icon: string;
}

export interface AppStateData {
  dsaItems: Record<string, {
    status: ItemStatus;
    notes?: string;
    startedAt?: string;
    completedAt?: string;
  }>;
  milestones: Record<string, Milestone>;
  csFundTopics: CsFundTopic[];
  projects: ProjectItem[];
  applications: JobApplication[];
  activityLogs: Record<string, number>; // date "YYYY-MM-DD" -> count
  theme: 'light' | 'dark';
}
