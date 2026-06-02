export type LayoutType = 'single' | 'two-col'
export type SectionTitleStyle = 'underline' | 'border-bottom' | 'accent-bar'
export type BulletStyle = 'dot' | 'dash' | 'plain'
export type SkillDisplay = 'badge' | 'pill' | 'comma-list'

export type TemplateTheme = {
  layout: LayoutType
  colors: {
    accent: string
    secondary: string
    background: string
    text: string
    textMuted: string
  }
  fonts: {
    name: string
    heading: string
    body: string
    mono: string
  }
  fontSize: {
    name: string
    title: string
    sectionHeading: string
    body: string
    small: string
  }
  sectionTitle: SectionTitleStyle
  bullet: BulletStyle
  skillDisplay: SkillDisplay
  spacing: {
    pagePadding: string
    sidebarPadding: string
    sectionGap: string
  }
}

export function mergeWithATS(theme: TemplateTheme): TemplateTheme {
  return {
    ...theme,
    layout: 'single',
    fonts: {
      name: '"Arial", "Helvetica", sans-serif',
      heading: '"Arial", "Helvetica", sans-serif',
      body: '"Arial", "Helvetica", sans-serif',
      mono: '"Courier New", monospace',
    },
    fontSize: {
      ...theme.fontSize,
      name: '24px',
    },
    sectionTitle: 'accent-bar',
    bullet: 'dash',
    skillDisplay: 'comma-list',
    colors: {
      ...theme.colors,
      accent: '#000000',
      secondary: '#333333',
      text: '#111111',
      textMuted: '#444444',
    },
  }
}

export type TemplateCategory = 'design' | 'minimal'

export const PAGE_WIDTH = 794
export const PAGE_HEIGHT = 1123
