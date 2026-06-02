import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'

export function renderSummary(summary: string, theme: TemplateTheme) {
  if (!summary) return null

  if (theme.layout === 'two-col') {
    return (
      <div style={{ marginBottom: '16px', paddingBottom: '10px', paddingLeft: '12px', borderLeft: `3px solid ${theme.colors.secondary}` }}>
        <p style={{ fontSize: '10.5px', color: '#333', lineHeight: '1.65', margin: '0', fontStyle: 'italic' }}>
          &ldquo;{summary}&rdquo;
        </p>
      </div>
    )
  }

  return (
    <section>
      <SectionTitle label="Professional Summary" theme={theme} />
      <p style={{ margin: '0', color: '#222222', fontSize: theme.fontSize.body }}>{summary}</p>
    </section>
  )
}
