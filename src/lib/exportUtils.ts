import * as XLSX from 'xlsx';
import { AppStateData, DsaTrack } from '../types';

export function exportProgressToExcel(data: AppStateData, dsaTracks: DsaTrack[]) {
  const wb = XLSX.utils.book_new();

  // 1. DSA Practice Sheet
  const dsaRows: Array<{
    Track: string;
    Section: string;
    Subsection: string;
    'Problem / Topic': string;
    Type: string;
    Difficulty: string;
    Status: string;
    'Completed Date': string;
    'Started Date': string;
    'Practice Link': string;
    'Video Link': string;
    'Article Link': string;
    Notes: string;
  }> = [];

  dsaTracks.forEach((track) => {
    track.sections.forEach((sec) => {
      sec.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          const override = data.dsaItems[item.id];
          const status = override?.status || item.status || 'pending';
          const notes = override?.notes || item.notes || '';
          const completedAt = override?.completedAt || (item.status === 'completed' ? (item.completedAt || 'Excel Progress') : '');
          const startedAt = override?.startedAt || item.startedAt || '';

          dsaRows.push({
            Track: track.title,
            Section: sec.title,
            Subsection: sub.title,
            'Problem / Topic': item.title,
            Type: item.links.isTheory ? 'Theory / Concept' : 'Problem Solving',
            Difficulty: item.difficulty || 'Medium',
            Status: status.toUpperCase(),
            'Completed Date': completedAt,
            'Started Date': startedAt,
            'Practice Link': item.links.practice || '',
            'Video Link': item.links.video || '',
            'Article Link': item.links.article || '',
            Notes: notes,
          });
        });
      });
    });
  });

  const wsDsa = XLSX.utils.json_to_sheet(dsaRows);
  XLSX.utils.book_append_sheet(wb, wsDsa, 'DSA Problems');

  // 2. Development Roadmap Sheet
  const devMilestones = Object.values(data.milestones || {})
    .filter((m) => m.areaId === 'development')
    .sort((a, b) => a.order - b.order);

  const devRows: Array<{
    Milestone: string;
    Concept: string;
    Completed: string;
    'Tech Stack': string;
  }> = [];

  devMilestones.forEach((m) => {
    m.concepts.forEach((c) => {
      devRows.push({
        Milestone: `M${m.order}: ${m.title}`,
        Concept: c.label,
        Completed: c.done ? 'YES' : 'NO',
        'Tech Stack': m.stack.join(', '),
      });
    });
  });

  const wsDev = XLSX.utils.json_to_sheet(devRows);
  XLSX.utils.book_append_sheet(wb, wsDev, 'Development');

  // 3. AI & Tools Sheet
  const aiMilestones = Object.values(data.milestones || {})
    .filter((m) => m.areaId === 'ai-tools')
    .sort((a, b) => a.order - b.order);

  const aiRows: Array<{
    Milestone: string;
    Concept: string;
    Completed: string;
    'Tech Stack': string;
  }> = [];

  aiMilestones.forEach((m) => {
    m.concepts.forEach((c) => {
      aiRows.push({
        Milestone: `M${m.order}: ${m.title}`,
        Concept: c.label,
        Completed: c.done ? 'YES' : 'NO',
        'Tech Stack': m.stack.join(', '),
      });
    });
  });

  const wsAi = XLSX.utils.json_to_sheet(aiRows);
  XLSX.utils.book_append_sheet(wb, wsAi, 'AI Tools');

  // 4. Study Sessions Sheet
  const sessions = data.studySessions || [];
  const sessionRows = sessions.map((s) => ({
    Date: s.date,
    Category: s.category,
    Minutes: s.minutes,
    Hours: (s.minutes / 60).toFixed(2),
    Note: s.note || '',
    'Logged At': s.createdAt || '',
  }));
  const wsStudy = XLSX.utils.json_to_sheet(sessionRows);
  XLSX.utils.book_append_sheet(wb, wsStudy, 'Study Hours');

  // 5. CS Fundamentals Sheet
  const csTopics = data.csFundTopics || [];
  const csRows = csTopics.map((t) => ({
    Category: t.category,
    Topic: t.title,
    Completed: t.completed ? 'YES' : 'NO',
    'Completed Date': t.completedAt || (t.completed ? 'Completed' : ''),
    Notes: t.notes || '',
  }));
  const wsCs = XLSX.utils.json_to_sheet(csRows);
  XLSX.utils.book_append_sheet(wb, wsCs, 'CS Fundamentals');

  // 6. Internship Applications Sheet
  const apps = data.applications || [];
  const appRows = apps.map((a) => ({
    Company: a.company,
    Role: a.role,
    Status: a.status,
    'Applied Date': a.appliedDate,
    Location: a.location || '',
    Notes: a.notes || '',
  }));
  const wsApps = XLSX.utils.json_to_sheet(appRows);
  XLSX.utils.book_append_sheet(wb, wsApps, 'Job Applications');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `placement-prep-tracker-${today}.xlsx`);
}

export function exportProgressToCsv(data: AppStateData, dsaTracks: DsaTrack[]) {
  const rows: Array<{
    Area: string;
    Section: string;
    'Item / Problem': string;
    Type: string;
    Status: string;
    'Completed Date': string;
    'Started Date': string;
    'Practice / Video Link': string;
    'Details / Notes': string;
  }> = [];

  // DSA items
  dsaTracks.forEach((track) => {
    track.sections.forEach((sec) => {
      sec.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          const override = data.dsaItems[item.id];
          const status = override?.status || item.status || 'pending';
          const completedAt = override?.completedAt || (item.status === 'completed' ? (item.completedAt || 'Excel Progress') : '');
          const startedAt = override?.startedAt || item.startedAt || '';
          rows.push({
            Area: 'DSA',
            Section: `${sec.title} > ${sub.title}`,
            'Item / Problem': item.title,
            Type: item.links.isTheory ? 'Theory' : 'Problem',
            Status: status.toUpperCase(),
            'Completed Date': completedAt,
            'Started Date': startedAt,
            'Practice / Video Link': item.links.practice || item.links.video || item.links.article || '',
            'Details / Notes': override?.notes || item.notes || '',
          });
        });
      });
    });
  });

  // Development
  Object.values(data.milestones || {})
    .filter((m) => m.areaId === 'development')
    .forEach((m) => {
      m.concepts.forEach((c) => {
        rows.push({
          Area: 'Development',
          Section: `Milestone ${m.order}: ${m.title}`,
          'Item / Problem': c.label,
          Type: 'Concept',
          Status: c.done ? 'COMPLETED' : 'PENDING',
          'Completed Date': c.done ? 'Completed' : '',
          'Started Date': '',
          'Practice / Video Link': '',
          'Details / Notes': m.stack.join(', '),
        });
      });
    });

  // AI Tools
  Object.values(data.milestones || {})
    .filter((m) => m.areaId === 'ai-tools')
    .forEach((m) => {
      m.concepts.forEach((c) => {
        rows.push({
          Area: 'AI Tools',
          Section: `Milestone ${m.order}: ${m.title}`,
          'Item / Problem': c.label,
          Type: 'Concept',
          Status: c.done ? 'COMPLETED' : 'PENDING',
          'Completed Date': c.done ? 'Completed' : '',
          'Started Date': '',
          'Practice / Video Link': '',
          'Details / Notes': m.stack.join(', '),
        });
      });
    });

  // Study hours summary
  (data.studySessions || []).forEach((s) => {
    rows.push({
      Area: 'Study Session',
      Section: s.date,
      'Item / Problem': `${s.category} (${s.minutes} mins)`,
      Type: 'Focus Session',
      Status: 'LOGGED',
      'Completed Date': s.date,
      'Started Date': s.createdAt || '',
      'Practice / Video Link': '',
      'Details / Notes': s.note || '',
    });
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const csvOutput = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const today = new Date().toISOString().split('T')[0];
  a.download = `placement-prep-tracker-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
