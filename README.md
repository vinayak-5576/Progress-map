# Placement & Internship Prep Tracker

A high-focus, single-user personal web application engineered for daily preparation tracking across Algorithms (DSA), Full-Stack Engineering, AI Systems, CS Fundamentals, and Internship applications.

Built with an editorial **Navy / Cream / Coral** aesthetic, inspired by modern typography and tactile physical notebooks.

---

## 🎨 Theme System

- **Navy (`#14233B`)**: Dark surfaces, hero panels, sidebars, primary dark text.
- **Cream (`#F4EEE3`)**: Warm tactile page background, light cards, subtle surfaces.
- **Coral (`#F2685B`)**: High-contrast action accents, progress fills, streaks, and focus highlights.
- **Typography**:
  - Headings: **Fraunces** (Editorial Display Serif)
  - UI & Body: **DM Sans** (Clean, modern geometric sans)

---

## 🛠️ Stack

- **Vite 6** + **React 18** + **TypeScript** (Strict)
- **Tailwind CSS 3** with custom theme tokens & dark mode class toggling
- **Zustand 5** for state management
- **React Router 6** for seamless multi-view navigation
- **Lucide React** for consistent vector iconography
- **Recharts** for the weighted readiness ring gauge and weekly output velocity bar charts
- **Repository Pattern (`ProgressRepo`)**: Clean LocalStorage implementation today, ready for drop-in Firebase / Supabase backend integration without altering UI components.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📊 Generating `dsa.json` from Excel

The application includes an offline conversion script that processes your master syllabus spreadsheet:

```bash
npm run parse-dsa
# or: npx tsx scripts/excel-to-json.ts
```

### Script Behavior:
1. Locates `data/Master_DSA_using_GFG_and_Leetcode.xlsx` (or in project root).
2. Parses **Sheet1** as **"Main DSA Course"** (17 sections, 267 problems) and **Sheet2** as **"Advance DSA (Zero to Hero)"** (18 sections, 415 problems).
3. Detects Section headers (`1. Basics of programming`), Subsection headers (`1.1 Time and Space Complexity`), and Problem rows.
4. Preserves your existing `Completed` / `Pending` statuses, problem URLs (LeetCode/GFG), YouTube video links, and tutorial article links.
5. Emits `src/data/dsa.json`. Note that the Excel file is never parsed in the browser for maximum client performance.

---

## 📱 Mobile-First Responsive Design

- **Desktop**: Persistent sidebar with quick-access tracks and live readiness indicator.
- **Mobile**: Touch-optimized bottom navigation bar with safe-area spacing and a slide-up "More" drawer for secondary tracks.

---

## 💾 Data Portability

Navigate to the **Settings** page (`/settings`) to:
- Download a full JSON snapshot of your progress.
- Restore/import previous JSON backups.
- Toggle between Warm Cream (Light) and Dark Navy modes.
- Reset to fresh initial seed state.
