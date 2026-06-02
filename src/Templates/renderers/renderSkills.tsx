import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'

export function renderSkills(skills: string[], theme: TemplateTheme) {
  const filtered = skills.filter((s) => s.trim())
  if (filtered.length === 0) return null

  switch (theme.skillDisplay) {
    case 'pill':
      return (
        <>
          <SectionTitle label="Skills" theme={theme} sidebar />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {filtered.map((s, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  borderRadius: '3px',
                  padding: '3px 7px',
                  fontSize: '8.5px',
                  fontWeight: '500',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </>
      )
    case 'comma-list':
      return (
        <section>
          <SectionTitle label="Skills" theme={theme} />
          <p style={{ margin: '0', color: '#1f1f1f', fontSize: theme.fontSize.body }}>
            {filtered.join(', ')}
          </p>
        </section>
      )
    case 'badge':
    default:
      return (
        <section>
          <SectionTitle label="Skills" theme={theme} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {filtered.map((s, i) => (
              <span
                key={i}
                style={{
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '9.5px',
                  fontWeight: '500',
                  background: `${theme.colors.accent}18`,
                  border: `1px solid ${theme.colors.accent}44`,
                  color: theme.colors.accent,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )
  }
}
