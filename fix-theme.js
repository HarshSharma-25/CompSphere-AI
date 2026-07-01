const fs = require('fs');
const path = require('path');

const files = [
  'components/gst/Gstr2bMatchingGrid.tsx',
  'components/audit/BenfordsForensicDashboard.tsx',
  'components/litigation/NoticeDraftingPanel.tsx',
  'components/payroll/PayrollConsole.tsx',
  'components/onboarding/ClientOnboardingWizard.tsx'
];

const replacements = [
  { regex: /\bbg-slate-950\/(\d+)\b/g, replace: 'bg-slate-100 dark:bg-slate-950/$1' },
  { regex: /\bbg-slate-950\b/g, replace: 'bg-slate-50 dark:bg-slate-950' },
  { regex: /\bbg-slate-900\/(\d+)\b/g, replace: 'bg-slate-100 dark:bg-slate-900/$1' },
  { regex: /\bbg-slate-900\b/g, replace: 'bg-slate-100 dark:bg-slate-900' },
  { regex: /\bbg-slate-800\b/g, replace: 'bg-slate-200 dark:bg-slate-800' },
  { regex: /\bborder-slate-800\b/g, replace: 'border-slate-200 dark:border-slate-800' },
  { regex: /\bborder-slate-900\b/g, replace: 'border-slate-200 dark:border-slate-900' },
  { regex: /\bborder-slate-900\/(\d+)\b/g, replace: 'border-slate-200 dark:border-slate-900/$1' },
  { regex: /\btext-slate-400\b/g, replace: 'text-slate-500 dark:text-slate-400' },
  { regex: /\btext-slate-300\b/g, replace: 'text-slate-600 dark:text-slate-300' },
  { regex: /\btext-slate-200\b/g, replace: 'text-slate-700 dark:text-slate-200' },
  { regex: /\btext-slate-100\b/g, replace: 'text-slate-900 dark:text-slate-100' },
  { regex: /\btext-white\b/g, replace: 'text-slate-900 dark:text-white' }
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  replacements.forEach(({ regex, replace }) => {
    // Avoid double-replacing if dark: is already there
    // This is a simple script so we just do a blind replace and then clean up doubles if they happen
    content = content.replace(regex, replace);
  });
  
  // Cleanup duplicates that might have happened if it was already "text-slate-900 dark:text-white" and text-white got replaced again
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/bg-white dark:bg-white dark:bg-\[\#0F1B2D\]/g, 'bg-white dark:bg-[#0F1B2D]');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${file}`);
});
