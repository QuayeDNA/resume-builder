import type { ProjectEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'

export function renderProjects(projects: ProjectEntry[], theme: TemplateTheme) {
  if (projects.length === 0) return null

  return (
    <section>
      <SectionTitle label="Projects" theme={theme} />
      {projects.map((pr, idx) => (
        <div key={pr.id} style={{ marginTop: idx > 0 ? '10px' : '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{pr.name}</span>
            {pr.url && (
              <span style={{ fontSize: '9.5px', textDecoration: 'underline', flexShrink: 0, color: theme.colors.secondary }}>
                View
              </span>
            )}
          </div>
          {pr.description && (
            <p style={{ fontSize: '10px', color: '#333', margin: '4px 0 0 0' }}>
              {pr.description}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}
