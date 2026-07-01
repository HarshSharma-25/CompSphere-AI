const fs = require('fs');
const path = require('path');

const files = [
  'components/gst/Gstr2bMatchingGrid.tsx',
  'components/audit/BenfordsForensicDashboard.tsx',
  'components/litigation/NoticeDraftingPanel.tsx',
  'components/payroll/PayrollConsole.tsx',
  'components/onboarding/ClientOnboardingWizard.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  content = content.replace(/dark:border-slate-200 dark:border-slate-800/g, 'dark:border-slate-800');
  content = content.replace(/dark:bg-slate-100 dark:bg-slate-900/g, 'dark:bg-slate-900');
  content = content.replace(/hover:bg-slate-200 dark:bg-slate-800/g, 'hover:bg-slate-100 dark:hover:bg-slate-800');
  content = content.replace(/dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:text-slate-900 dark:text-white/g, 'dark:text-white');
  
  fs.writeFileSync(fullPath, content, 'utf8');
});
