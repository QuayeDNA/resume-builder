export const TEMPLATES = {
  modern: {
    label:     'Modern',
    accent:    '#1a1a2e',
    secondary: '#6c63ff',
    layout:    'single',
  },
  clean: {
    label:     'Clean',
    accent:    '#0f172a',
    secondary: '#0ea5e9',
    layout:    'single',
  },
  warm: {
    label:     'Warm',
    accent:    '#1c1917',
    secondary: '#ea580c',
    layout:    'single',
  },
  forest: {
    label:     'Forest',
    accent:    '#14532d',
    secondary: '#16a34a',
    layout:    'single',
  },
  rose: {
    label:     'Rose',
    accent:    '#1f1f1f',
    secondary: '#e11d48',
    layout:    'single',
  },
  executive: {
    label:     'Executive',
    accent:    '#1e293b',
    secondary: '#94a3b8',
    layout:    'single',
  },
  sidebar: {
    label:     'Sidebar',
    accent:    '#1e1b4b',
    secondary: '#818cf8',
    layout:    'two-col',
  },
  compact: {
    label:     'Compact',
    accent:    '#18181b',
    secondary: '#f59e0b',
    layout:    'two-col',
  },
}

export function getTemplate(key) {
  return TEMPLATES[key] || TEMPLATES.modern
}
