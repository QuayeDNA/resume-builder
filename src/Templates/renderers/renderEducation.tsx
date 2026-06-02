import type { EducationEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'
import DateRange from '../components/DateRange'

export function renderEducation(education: EducationEntry[], theme: TemplateTheme) {
  if (education.length === 0) return null

  return (
    <section>
      <SectionTitle label="Education" theme={theme} />
      {education.map((e, idx) => (
        <div
          key={e.id}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginTop: idx > 0 ? '10px' : '0' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: '600', fontSize: '11px', color: '#1a1a1a' }}>{e.degree}</span>
            {e.school && (
              <span style={{ marginLeft: '6px', fontSize: '10.5px', color: theme.colors.secondary }}>
                · {e.school}
              </span>
            )}
          </div>
          <div style={{ fontSize: '9.5px', color: '#777', textAlign: 'right', flexShrink: 0 }}>
            <DateRange start={e.start} end={e.end} theme={theme} />
            {e.gpa && <div style={{ whiteSpace: 'nowrap' }}>GPA: {e.gpa}</div>}
          </div>
        </div>
      ))}
    </section>
  )
}
