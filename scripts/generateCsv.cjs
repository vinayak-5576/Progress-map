const fs = require('fs');
const path = require('path');
const dsa = require('../src/data/dsa.json');

const headers = [
  'Area',
  'Section',
  'Subsection',
  'Problem / Topic Title',
  'Type',
  'Difficulty',
  'Status',
  'Completed Date',
  'Practice Link',
  'Video Link',
  'Article Link'
];

function escapeCsv(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const rows = [headers.join(',')];

// DSA rows
dsa.forEach((track) => {
  track.sections.forEach((sec) => {
    sec.subsections.forEach((sub) => {
      sub.items.forEach((item) => {
        const isCompleted = item.status === 'completed';
        const completedDate = item.completedAt || (isCompleted ? 'Excel Progress' : '');
        rows.push([
          escapeCsv(`DSA (${track.title})`),
          escapeCsv(sec.title),
          escapeCsv(sub.title),
          escapeCsv(item.title),
          escapeCsv(item.links && item.links.isTheory ? 'Theory' : 'Problem Solving'),
          escapeCsv(item.difficulty || 'Medium'),
          escapeCsv((item.status || 'pending').toUpperCase()),
          escapeCsv(completedDate),
          escapeCsv(item.links ? item.links.practice || '' : ''),
          escapeCsv(item.links ? item.links.video || '' : ''),
          escapeCsv(item.links ? item.links.article || '' : '')
        ].join(','));
      });
    });
  });
});

const outputPath = path.resolve(__dirname, '..', 'placement-prep-progress.csv');
fs.writeFileSync(outputPath, rows.join('\r\n'), 'utf8');
console.log('Successfully written', rows.length - 1, 'items to placement-prep-progress.csv');
