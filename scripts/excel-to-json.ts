import fs from 'fs';
import path from 'path';
import * as xlsxModule from 'xlsx';

// Handle CJS/ESM interop for SheetJS
const XLSX = (xlsxModule as any).default || xlsxModule;


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
  status: 'pending' | 'in_progress' | 'completed';
  links: ItemLinks;
  notes?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
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

function getCellValue(cell: xlsxModule.CellObject | undefined): string {
  if (!cell) return '';
  if (cell.w !== undefined) return String(cell.w).trim();
  if (cell.v !== undefined) return String(cell.v).trim();
  return '';
}

function getCellLink(cell: xlsxModule.CellObject | undefined): string {
  if (!cell) return '';
  if (cell.l && cell.l.Target) {
    return String(cell.l.Target).trim();
  }
  const val = getCellValue(cell);
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  return '';
}

function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseSheet(sheet: xlsxModule.WorkSheet, trackId: string, trackTitle: string): DsaTrack {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:E1');
  const sections: DsaSection[] = [];

  let currentSection: DsaSection | null = null;
  let currentSubsection: DsaSubsection | null = null;
  let itemCount = 0;

  for (let R = range.s.r; R <= range.e.r; ++R) {
    const cellA = sheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
    const cellB = sheet[XLSX.utils.encode_cell({ r: R, c: 1 })];
    const cellC = sheet[XLSX.utils.encode_cell({ r: R, c: 2 })];
    const cellD = sheet[XLSX.utils.encode_cell({ r: R, c: 3 })];
    const cellE = sheet[XLSX.utils.encode_cell({ r: R, c: 4 })];

    const valA = getCellValue(cellA);
    const valB = getCellValue(cellB);
    const valC = getCellValue(cellC);
    const valD = getCellValue(cellD);
    const valE = getCellValue(cellE);

    // Skip completely empty rows
    if (!valA && !valB && !valC && !valD && !valE) {
      continue;
    }

    // Skip table header rows and promotional links
    const lowerB = valB.toLowerCase();
    const lowerA = valA.toLowerCase();
    if (
      lowerB === 'problem statement' ||
      lowerB === 'problem' ||
      lowerB === 'title' ||
      lowerB.includes('click here to track') ||
      lowerB.includes('course link') ||
      (lowerA === 'status' && (lowerB.includes('problem') || lowerB.includes('topic') || lowerB === ''))
    ) {
      continue;
    }

    // Check if row is a section header, e.g. "1. Basics of programming" or "Section 1"
    // Usually starts with a number followed by dot, e.g. "1. " or "10. ", and not "1.1 "
    const isSubsectionPattern = /^\d+\.\d+(\.|\s|$)/.test(valB);
    const isSectionPattern = /^\d+\.\s+[^\d]/.test(valB) || (/^\d+\./.test(valB) && !isSubsectionPattern);

    if (isSectionPattern && !valA && !valC && !valD) {
      const secId = `${trackId}-sec-${sanitizeId(valB)}`;
      currentSection = {
        id: secId,
        title: valB,
        subsections: [],
      };
      sections.push(currentSection);
      // Default subsection
      currentSubsection = null;
      continue;
    }

    // Check if row is a subsection header, e.g. "1.1 Time and Space Complexity"
    if (isSubsectionPattern && !valA && !valC && !valD) {
      if (!currentSection) {
        currentSection = {
          id: `${trackId}-sec-default`,
          title: 'General',
          subsections: [],
        };
        sections.push(currentSection);
      }
      const subId = `${currentSection.id}-sub-${sanitizeId(valB)}`;
      currentSubsection = {
        id: subId,
        title: valB,
        items: [],
      };
      currentSection.subsections.push(currentSubsection);
      continue;
    }

    // Otherwise, this row could be an item
    // It is an item if valB has a title
    if (valB) {
      itemCount++;
      if (!currentSection) {
        currentSection = {
          id: `${trackId}-sec-1`,
          title: 'General & Core Topics',
          subsections: [],
        };
        sections.push(currentSection);
      }
      if (!currentSubsection) {
        currentSubsection = {
          id: `${currentSection.id}-sub-1`,
          title: currentSection.title,
          items: [],
        };
        currentSection.subsections.push(currentSubsection);
      }

      // Determine status from Excel column A
      let status: 'pending' | 'in_progress' | 'completed' = 'pending';
      const cleanA = valA.trim().toLowerCase();
      if (cleanA === 'completed' || cleanA === 'done' || cleanA === 'yes' || cleanA === '1') {
        status = 'completed';
      } else if (cleanA === 'in progress' || cleanA === 'in_progress' || cleanA === 'doing') {
        status = 'in_progress';
      }

      // Determine links
      const practiceLink = getCellLink(cellC) || (valC.startsWith('http') ? valC : undefined);
      const videoLink = getCellLink(cellD) || (valD.startsWith('http') ? valD : undefined);
      const articleLink = getCellLink(cellE) || (valE.startsWith('http') ? valE : undefined);
      const isTheory = valC.toLowerCase().includes('theory');
      const practiceTitle = valC && valC !== '-' && !valC.startsWith('http') ? valC : undefined;
      const articleTitle = valE && valE !== '-' && !valE.startsWith('http') ? valE : undefined;

      // Infer difficulty if mentioned in title or text
      let difficulty: 'Easy' | 'Medium' | 'Hard' | undefined = undefined;
      const combinedText = `${valB} ${valA} ${valC} ${valE}`.toLowerCase();
      if (combinedText.includes('(easy)') || combinedText.includes('[easy]') || combinedText.includes('easy')) {
        difficulty = 'Easy';
      } else if (combinedText.includes('(hard)') || combinedText.includes('[hard]') || combinedText.includes('hard')) {
        difficulty = 'Hard';
      } else if (combinedText.includes('(medium)') || combinedText.includes('[medium]') || combinedText.includes('medium')) {
        difficulty = 'Medium';
      }

      const item: Item = {
        id: `${trackId}-item-${itemCount}`,
        areaId: 'dsa',
        sectionId: currentSection.id,
        subsectionId: currentSubsection.id,
        title: valB,
        status,
        links: {
          practice: practiceLink,
          practiceTitle,
          isTheory,
          video: videoLink,
          article: articleLink,
          articleTitle,
        },
        difficulty,
        completedAt: status === 'completed' ? 'Excel Progress' : undefined,
      };

      currentSubsection.items.push(item);
    }
  }

  // Filter out empty sections or subsections
  const cleanedSections = sections
    .map((sec) => ({
      ...sec,
      subsections: sec.subsections.filter((sub) => sub.items.length > 0),
    }))
    .filter((sec) => sec.subsections.length > 0);

  return {
    id: trackId,
    title: trackTitle,
    sections: cleanedSections,
  };
}

export function convertExcelToJson() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'data/Master_DSA_using_GFG_and_Leetcode.xlsx'),
    path.resolve(process.cwd(), 'data/Master DSA using GFG and Leetcode.xlsx'),
    path.resolve(process.cwd(), 'Master DSA using GFG and Leetcode.xlsx'),
  ];

  let excelPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      excelPath = p;
      break;
    }
  }

  if (!excelPath) {
    console.error('Error: Master DSA excel file not found in /data or root!');
    process.exit(1);
  }

  console.log(`Reading Excel file from: ${excelPath}`);
  const workbook = XLSX.readFile(excelPath, { cellFormula: false, cellHTML: false });

  const sheetNames = workbook.SheetNames;
  console.log('Found sheets:', sheetNames);

  const tracks: DsaTrack[] = [];

  if (sheetNames.length > 0) {
    const s1 = workbook.Sheets[sheetNames[0]];
    const t1 = parseSheet(s1, 'track-main', 'Main DSA Course');
    tracks.push(t1);
    console.log(`Parsed Sheet 1: ${t1.sections.length} sections, total items: ${countTrackItems(t1)}`);
  }

  if (sheetNames.length > 1) {
    const s2 = workbook.Sheets[sheetNames[1]];
    const t2 = parseSheet(s2, 'track-advance', 'Advance DSA (Zero to Hero)');
    tracks.push(t2);
    console.log(`Parsed Sheet 2: ${t2.sections.length} sections, total items: ${countTrackItems(t2)}`);
  }

  const outDir = path.resolve(process.cwd(), 'src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'dsa.json');
  fs.writeFileSync(outPath, JSON.stringify(tracks, null, 2), 'utf-8');
  console.log(`Successfully generated ${outPath} with ${tracks.length} tracks!`);
}

function countTrackItems(track: DsaTrack): number {
  return track.sections.reduce(
    (acc, sec) => acc + sec.subsections.reduce((sAcc, sub) => sAcc + sub.items.length, 0),
    0
  );
}

// Auto-run if executed directly
convertExcelToJson();
