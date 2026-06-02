import type { LanguageEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'

export function renderLanguages(languages: LanguageEntry[], theme: TemplateTheme) {
  if (!languages || languages.length === 0) return null

  if (theme.layout === 'two-col') {
    return (
      <>
        <SectionTitle label="Languages" theme={theme} sidebar />
        {languages.map((l) => (
          <div key={l.id} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#ffffff' }}>{l.language}</div>
            <div style={{ fontSize: '8px', color: theme.colors.secondary }}>{l.proficiency}</div>
          </div>
        ))}
      </>
    )
  }

  return (
    <section>
      <SectionTitle label="Languages" theme={theme} />
      {languages.map((l, idx) => (
        <div
          key={l.id}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: idx > 0 ? '8px' : '0' }}
        >
          <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{l.language}</span>
          <span style={{ fontSize: '9.5px', color: theme.colors.secondary }}>{l.proficiency}</span>
        </div>
      ))}
    </section>
  )
}
