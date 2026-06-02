import type { ExperienceEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'
import Bullet from '../components/Bullet'
import DateRange from '../components/DateRange'

export function renderExperience(experience: ExperienceEntry[], theme: TemplateTheme) {
  if (experience.length === 0) return null

  return (
    <section>
      <SectionTitle label="Experience" theme={theme} />
      {experience.map((e, idx) => (
        <div key={e.id} style={{ marginTop: idx > 0 ? '14px' : '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.role}</span>
              {e.company && (
                <span style={{ fontWeight: '600', marginLeft: '6px', fontSize: '10.5px', color: theme.colors.secondary }}>
                  @ {e.company}
                </span>
              )}
            </div>
            <div style={{ fontSize: '9.5px', color: '#777', textAlign: 'right', flexShrink: 0 }}>
              <DateRange start={e.start} end={e.end} theme={theme} />
              {e.location && <div style={{ whiteSpace: 'nowrap' }}>{e.location}</div>}
            </div>
          </div>
          {e.bullets.filter((b) => b.trim()).map((b, i) => (
            <Bullet key={i} text={b} theme={theme} />
          ))}
        </div>
      ))}
    </section>
  )
}
