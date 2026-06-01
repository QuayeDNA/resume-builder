/* Design tokens — always use CSS variables for runtime; this file is for TS constants */

export const COLORS = {
  paper:       '#f8f4f0',
  paperWarm:   '#f0ebe4',
  paperDeep:   '#e8e0d6',
  ink:         '#2a2520',
  inkSoft:     '#6b6258',
  inkMuted:    '#9c9287',
  terracotta:   '#c76b4a',
  terracottaDim: 'rgba(199,107,74,0.12)',
  sage:        '#8ca98c',
  sageDim:     'rgba(140,169,140,0.12)',
  warmBorder:  'rgba(42,37,32,0.08)',
  warmBorderStrong: 'rgba(42,37,32,0.15)',
  success:     '#4ade80',
  successSubtle: 'rgba(74,222,128,0.12)',
  warning:     '#fbbf24',
  warningSubtle: 'rgba(251,191,36,0.10)',
  error:       '#d05c5c',
  errorSubtle: 'rgba(208,92,92,0.10)',
  info:        '#5b8ec9',
  infoSubtle:  'rgba(91,142,201,0.08)',
  ai:          '#8ca98c',
  aiSubtle:    'rgba(140,169,140,0.12)',
  aiHover:     'rgba(140,169,140,0.20)',
}

export const SPACING = {
  tight: '8px',
  normal: '12px',
  relaxed: '16px',
  loose: '24px',
}

export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}
