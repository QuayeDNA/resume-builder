import type { CertificationEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'

export function renderCertifications(certifications: CertificationEntry[], theme: TemplateTheme) {
  if (certifications.length === 0) return null

  if (theme.layout === 'two-col') {
    return (
      <>
        <SectionTitle label="Certifications" theme={theme} sidebar />
        {certifications.map((c) => (
          <div key={c.id} style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '9px', fontWeight: '600', color: '#ffffff' }}>{c.name}</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.55)' }}>
              {c.issuer}{c.year ? ` · ${c.year}` : ''}
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <section>
      <SectionTitle label="Certifications" theme={theme} />
      {certifications.map((c, idx) => (
        <div key={c.id} style={{ marginTop: idx > 0 ? '8px' : '0' }}>
          <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{c.name}</span>
          {(c.issuer || c.year) && (
            <div style={{ fontSize: '9.5px', color: '#777' }}>
              {c.issuer}{c.year ? ` · ${c.year}` : ''}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
