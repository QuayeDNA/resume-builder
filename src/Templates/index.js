export const TEMPLATES = {
  modern: {
    label:     'Modern',
    accent:    '#1a1a2e',
    secondary: '#6c63ff',
    layout:    'single',
    category:  'design',
  },
  clean: {
    label:     'Clean',
    accent:    '#0f172a',
    secondary: '#0ea5e9',
    layout:    'single',
    category:  'design',
  },
  warm: {
    label:     'Warm',
    accent:    '#1c1917',
    secondary: '#ea580c',
    layout:    'single',
    category:  'design',
  },
  forest: {
    label:     'Forest',
    accent:    '#14532d',
    secondary: '#16a34a',
    layout:    'single',
    category:  'design',
  },
  rose: {
    label:     'Rose',
    accent:    '#1f1f1f',
    secondary: '#e11d48',
    layout:    'single',
    category:  'design',
  },
  executive: {
    label:     'Executive',
    accent:    '#1e293b',
    secondary: '#94a3b8',
    layout:    'single',
    category:  'design',
  },
  sidebar: {
    label:     'Sidebar',
    accent:    '#1e1b4b',
    secondary: '#818cf8',
    layout:    'two-col',
    category:  'design',
  },
  compact: {
    label:     'Compact',
    accent:    '#18181b',
    secondary: '#f59e0b',
    layout:    'two-col',
    category:  'design',
  },
  atsClassic: {
    label:     'Classic ATS',
    accent:    '#000000',
    secondary: '#333333',
    layout:    'ats',
    category:  'ats',
  },
  atsProfessional: {
    label:     'Professional ATS',
    accent:    '#1a365d',
    secondary: '#2d3748',
    layout:    'ats',
    category:  'ats',
  },
  atsMinimal: {
    label:     'Minimal ATS',
    accent:    '#2d2d2d',
    secondary: '#555555',
    layout:    'ats',
    category:  'ats',
  },
}

export function getTemplate(key) {
  return TEMPLATES[key] || TEMPLATES.modern
}
