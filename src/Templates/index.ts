import type { TemplateTheme, TemplateCategory } from './theme'

export { mergeWithATS } from './theme'
export type { TemplateTheme, TemplateCategory, LayoutType, SectionTitleStyle, BulletStyle, SkillDisplay } from './theme'
export { default as TemplateRenderer } from './TemplateRenderer'
export { default as CoverLetterRenderer } from './CoverLetterRenderer'

export type TemplateDefinition = {
  id: string
  label: string
  description: string
  category: TemplateCategory
  theme: TemplateTheme
}

export const TEMPLATES: Record<string, TemplateDefinition> = {
  modern: {
    id: 'modern',
    label: 'Modern',
    description: 'Clean single-column with bold indigo accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#1a1a2e', secondary: '#6c63ff', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  clean: {
    id: 'clean',
    label: 'Clean',
    description: 'Minimal single-column with sky-blue accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#0f172a', secondary: '#0ea5e9', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  warm: {
    id: 'warm',
    label: 'Warm',
    description: 'Earthy single-column with terracotta-orange accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#1c1917', secondary: '#ea580c', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    description: 'Nature-inspired single-column with green accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#14532d', secondary: '#16a34a', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    description: 'Elegant single-column with rose-pink accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#1f1f1f', secondary: '#e11d48', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  executive: {
    id: 'executive',
    label: 'Executive',
    description: 'Professional single-column with slate-gray accents',
    category: 'design',
    theme: {
      layout: 'single',
      colors: { accent: '#1e293b', secondary: '#94a3b8', background: '#ffffff', text: '#1a1a1a', textMuted: '#555555' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '12px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'underline',
      bullet: 'dot',
      skillDisplay: 'badge',
      spacing: { pagePadding: '48px 44px', sidebarPadding: '44px 20px', sectionGap: '14px' },
    },
  },
  sidebar: {
    id: 'sidebar',
    label: 'Sidebar',
    description: 'Two-column layout with indigo sidebar',
    category: 'design',
    theme: {
      layout: 'two-col',
      colors: { accent: '#1e1b4b', secondary: '#818cf8', background: '#ffffff', text: '#1a1a1a', textMuted: '#777777' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '11px', body: '10px', small: '9px' },
      sectionTitle: 'border-bottom',
      bullet: 'dot',
      skillDisplay: 'pill',
      spacing: { pagePadding: '44px 28px', sidebarPadding: '44px 20px', sectionGap: '12px' },
    },
  },
  compact: {
    id: 'compact',
    label: 'Compact',
    description: 'Space-efficient two-column with amber accents',
    category: 'design',
    theme: {
      layout: 'two-col',
      colors: { accent: '#18181b', secondary: '#f59e0b', background: '#ffffff', text: '#1a1a1a', textMuted: '#777777' },
      fonts: { name: "'Playfair Display', Georgia, serif", heading: "'DM Sans', Arial, sans-serif", body: "'DM Sans', Arial, sans-serif", mono: "'DM Mono', monospace" },
      fontSize: { name: '28px', title: '11px', sectionHeading: '11px', body: '10px', small: '9px' },
      sectionTitle: 'border-bottom',
      bullet: 'dot',
      skillDisplay: 'pill',
      spacing: { pagePadding: '44px 28px', sidebarPadding: '44px 20px', sectionGap: '12px' },
    },
  },
  atsClassic: {
    id: 'atsClassic',
    label: 'Classic ATS',
    description: 'Plain single-column optimized for applicant tracking systems',
    category: 'minimal',
    theme: {
      layout: 'single',
      colors: { accent: '#000000', secondary: '#333333', background: '#ffffff', text: '#111111', textMuted: '#444444' },
      fonts: { name: "'Arial', 'Helvetica', sans-serif", heading: "'Arial', 'Helvetica', sans-serif", body: "'Arial', 'Helvetica', sans-serif", mono: "'Courier New', monospace" },
      fontSize: { name: '24px', title: '11px', sectionHeading: '11px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'accent-bar',
      bullet: 'dash',
      skillDisplay: 'comma-list',
      spacing: { pagePadding: '46px 44px', sidebarPadding: '44px 20px', sectionGap: '10px' },
    },
  },
  atsProfessional: {
    id: 'atsProfessional',
    label: 'Professional ATS',
    description: 'Clean single-column with navy accents for ATS',
    category: 'minimal',
    theme: {
      layout: 'single',
      colors: { accent: '#1a365d', secondary: '#2d3748', background: '#ffffff', text: '#111111', textMuted: '#444444' },
      fonts: { name: "'Arial', 'Helvetica', sans-serif", heading: "'Arial', 'Helvetica', sans-serif", body: "'Arial', 'Helvetica', sans-serif", mono: "'Courier New', monospace" },
      fontSize: { name: '24px', title: '11px', sectionHeading: '11px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'accent-bar',
      bullet: 'dash',
      skillDisplay: 'comma-list',
      spacing: { pagePadding: '46px 44px', sidebarPadding: '44px 20px', sectionGap: '10px' },
    },
  },
  atsMinimal: {
    id: 'atsMinimal',
    label: 'Minimal ATS',
    description: 'Ultra-plain single-column for maximum ATS compatibility',
    category: 'minimal',
    theme: {
      layout: 'single',
      colors: { accent: '#2d2d2d', secondary: '#555555', background: '#ffffff', text: '#111111', textMuted: '#444444' },
      fonts: { name: "'Arial', 'Helvetica', sans-serif", heading: "'Arial', 'Helvetica', sans-serif", body: "'Arial', 'Helvetica', sans-serif", mono: "'Courier New', monospace" },
      fontSize: { name: '24px', title: '11px', sectionHeading: '11px', body: '10.5px', small: '9.5px' },
      sectionTitle: 'accent-bar',
      bullet: 'dash',
      skillDisplay: 'comma-list',
      spacing: { pagePadding: '46px 44px', sidebarPadding: '44px 20px', sectionGap: '10px' },
    },
  },
}

export type TemplateKey = keyof typeof TEMPLATES

export function getTemplate(key: string): TemplateDefinition {
  return TEMPLATES[key] || TEMPLATES.modern
}
